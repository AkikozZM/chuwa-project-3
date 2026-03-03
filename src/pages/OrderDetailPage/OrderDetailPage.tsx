import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderAPI, cancelOrderAPI } from "../../back-end/APITesting/Order.ts";
import type { IOrder } from "../../back-end/models/Order";
import { Card } from "../../components/Card/Card";

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
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

  const handleCancel = async () => {
    if (!id || order?.status === "CANCELLED") return;
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(true);
    const res = await cancelOrderAPI(id);
    setCancelling(false);
    if (res.success) setOrder(res.data);
    else alert(res.error || "Failed to cancel order.");
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

          {order.status !== "CANCELLED" && (
            <div className="pt-4">
              <button
                className="border border-red-500 text-white px-4 py-2 rounded !hover:bg-red-500 disabled:opacity-50"
                disabled={cancelling}
                onClick={handleCancel}
              >
                {cancelling ? "Cancelling…" : "Cancel order"}
              </button>
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
