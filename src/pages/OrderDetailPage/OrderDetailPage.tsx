import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUserId, selectIsLogin, selectRole } from "../../features/authenticate/authenticate";
import { getOrderAPI, cancelOrderAPI, confirmOrderAPI } from "../../back-end/APITesting/Order.ts";
import { submitPaymentAPI, refundPaymentAPI, getPaymentAPI, updatePaymentAPI } from "../../back-end/APITesting/Payment.ts";
import type { IOrder } from "../../back-end/models/Order";
import type { IPayment } from "../../back-end/models/Payment";
import { Card } from "../../components/Card/Card";

const ORDER_PAYMENT_KEY = "orderPayment_";
const PAYMENT_IDEMPOTENCY_KEY = "payment_idempotency_";
const REFUND_IDEMPOTENCY_KEY = "refund_idempotency_";

function getStoredPaymentId(orderId: string): string | null {
  try {
    const raw = localStorage.getItem(ORDER_PAYMENT_KEY + orderId);
    if (!raw) return null;
    const data = JSON.parse(raw) as { paymentId?: string };
    return data.paymentId ?? null;
  } catch {
    return null;
  }
}

function setStoredPaymentId(orderId: string, paymentId: string): void {
  try {
    localStorage.setItem(ORDER_PAYMENT_KEY + orderId, JSON.stringify({ paymentId }));
  } catch {
    // ignore
  }
}

function getOrCreateIdempotencyKey(storageKey: string): string {
  try {
    let key = sessionStorage.getItem(storageKey);
    if (!key) {
      key = crypto.randomUUID();
      sessionStorage.setItem(storageKey, key);
    }
    return key;
  } catch {
    return crypto.randomUUID();
  }
}

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = useAppSelector(selectUserId);
  const isLogin = useAppSelector(selectIsLogin);
  const role = useAppSelector(selectRole);
  const isAdmin = role === "Admin";
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [paying, setPaying] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [payment, setPayment] = useState<IPayment | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPaymentError(null);
    getOrderAPI(id)
      .then((res) => {
        if (cancelled) return;
        if (res.success) setOrder(res.data);
        else setError(res.error || "Order not found.");
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load order.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  // When we have an order, load any existing payment for this order (from previous visit)
  useEffect(() => {
    if (!id || !order) return;
    const paymentId = getStoredPaymentId(id);
    if (!paymentId) return;
    let cancelled = false;
    getPaymentAPI(paymentId).then((res) => {
      if (cancelled) return;
      if (res.success) setPayment(res.data);
    });
    return () => {
      cancelled = true;
    };
  }, [id, order]);

  const handleCancel = async () => {
    if (!id || order?.status === "CANCELLED") return;
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(true);
    const res = await cancelOrderAPI(id);
    setCancelling(false);
    if (res.success) setOrder(res.data);
    else alert(res.error || "Failed to cancel order.");
  };

  const handleConfirm = async () => {
    if (!id || !order || order.status !== "CREATED") return;
    setConfirming(true);
    const res = await confirmOrderAPI(id);
    setConfirming(false);
    if (res.success) setOrder(res.data);
    else alert(res.error || "Failed to confirm order.");
  };

  const handlePay = async () => {
    if (!id || !order || order.status === "CANCELLED") return;
    if (!isLogin || !userId) {
      navigate("/login");
      return;
    }
    setPaymentError(null);
    setPaying(true);
    const idempotencyKey = getOrCreateIdempotencyKey(PAYMENT_IDEMPOTENCY_KEY + id);
    const res = await submitPaymentAPI(
      {
        orderId: id,
        userId,
        amount: order.totalAmount,
        currency: "USD",
      },
      idempotencyKey
    );
    setPaying(false);
    if (res.success) {
      setPayment(res.data);
      if (res.data.status === "COMPLETED") {
        setStoredPaymentId(id, res.data.id);
        // Refetch order so status can show CONFIRMED if backend updated it; otherwise optimistically set CONFIRMED
        getOrderAPI(id).then((orderRes) => {
          if (orderRes.success) setOrder(orderRes.data);
          else setOrder((prev) => (prev ? { ...prev, status: "CONFIRMED" } : null));
        });
      }
      if (res.data.status === "FAILED") {
        setPaymentError("Payment failed (e.g. insufficient balance).");
      }
    } else {
      setPaymentError(res.error || "Payment failed.");
    }
  };

  const handleRefund = async () => {
    if (!payment || payment.status !== "COMPLETED") return;
    if (!window.confirm("Refund this payment?")) return;
    setRefunding(true);
    const idempotencyKey = getOrCreateIdempotencyKey(REFUND_IDEMPOTENCY_KEY + payment.id);
    const res = await refundPaymentAPI(payment.id, idempotencyKey);
    setRefunding(false);
    if (res.success) setPayment(res.data);
    else alert(res.error || "Refund failed.");
  };

  const handleMarkPaymentFailed = async () => {
    if (!payment || payment.status === "REFUNDED") return;
    if (!window.confirm("Mark this payment as FAILED?")) return;
    setUpdatingPayment(true);
    const res = await updatePaymentAPI(payment.id, { status: "FAILED" });
    setUpdatingPayment(false);
    if (res.success) setPayment(res.data);
    else alert(res.error || "Update failed.");
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  if (loading) return <div className="p-6">Loading order…</div>;
  if (error || !order)
    return (
      <div className="p-6">
        <p>{error ?? "Order not found."}</p>
        <button className="mt-4 underline" onClick={() => navigate("/orders")}>
          Back to My Orders
        </button>
      </div>
    );

  return (
    <div className="flex flex-col gap-20 p-6 w-full h-full">
      <div className="flex flex-col justify-between items-center w-full md:flex-row lg:flex-row">
        <div className="text-3xl font-bold py-4 md:py-0 lg:py-0">Order #{order.id.slice(0, 8)}</div>
        <button
          className="text-white"
          onClick={() => navigate("/orders")}
        >
          Back to My Orders
        </button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status</span>
            <span
              className={`font-semibold ${
                order.status === "CANCELLED"
                  ? "text-red-600"
                  : order.status === "CONFIRMED"
                    ? "text-green-600"
                    : "text-amber-600"
              }`}
            >
              {order.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Created</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Updated</span>
            <span>{formatDate(order.updatedAt)}</span>
          </div>

          <h3 className="font-semibold mt-4">Items</h3>
          <ul className="border-t pt-4 space-y-2">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-500 text-sm ml-2">× {item.quantity}</span>
                </div>
                <span className="text-[#5d30ff] font-semibold">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between text-lg font-bold pt-4">
            <span>Total</span>
            <span className="text-[#5d30ff]">${order.totalAmount.toFixed(2)}</span>
          </div>

          {/* Payment section */}
          {payment && (
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Payment</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-semibold ${
                    payment.status === "COMPLETED"
                      ? "text-green-600"
                      : payment.status === "REFUNDED"
                        ? "text-gray-600"
                        : payment.status === "FAILED"
                          ? "text-red-600"
                          : "text-amber-600"
                  }`}
                >
                  {payment.status}
                </span>
              </div>
              {payment.status === "COMPLETED" && isAdmin && (
                <button
                  className="mt-2 border border-gray-400 text-white px-4 py-2 rounded hover:bg-gray-100 disabled:opacity-50"
                  disabled={refunding}
                  onClick={handleRefund}
                >
                  {refunding ? "Refunding…" : "Refund"}
                </button>
              )}
              {payment.status !== "REFUNDED" && isAdmin && (
                <button
                  className="mt-2 ml-2 border border-red-500 text-white px-4 py-2 rounded hover:bg-red-900/30 disabled:opacity-50"
                  disabled={updatingPayment}
                  onClick={handleMarkPaymentFailed}
                >
                  {updatingPayment ? "Updating…" : "Mark as failed"}
                </button>
              )}
            </div>
          )}

          {paymentError && (
            <p className="text-red-600 text-sm mt-2">{paymentError}</p>
          )}

          {order.status !== "CANCELLED" && (
            <div className="pt-4 flex flex-wrap gap-2">
              {order.status === "CREATED" && isAdmin && (
                <button
                  className="bg-[#5d30ff] text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
                  disabled={confirming}
                  onClick={handleConfirm}
                >
                  {confirming ? "Confirming…" : "Confirm order"}
                </button>
              )}
              {(!payment || payment.status === "FAILED") && (
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  disabled={paying || !userId}
                  onClick={handlePay}
                >
                  {paying ? "Processing…" : "Pay now"}
                </button>
              )}
              {order.status !== "CONFIRMED" && isAdmin && (
                <button
                  className="border border-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                  disabled={cancelling}
                  onClick={handleCancel}
                >
                  {cancelling ? "Cancelling…" : "Cancel order"}
                </button>
              )}
            </div>
          )}

          <p className="text-sm text-gray-500 mt-4">
            Complete payment within 30 minutes or the order will be automatically cancelled.
          </p>
        </div>
      </Card>
    </div>
  );
};
