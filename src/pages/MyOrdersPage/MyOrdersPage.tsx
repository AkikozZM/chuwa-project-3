import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUserId, selectIsLogin, selectRole } from "../../features/authenticate/authenticate";
import { getOrdersByUserAPI, getAllOrdersAPI } from "../../back-end/APITesting/Order.ts";
import type { IOrder } from "../../back-end/models/Order";

const PAGE_SIZE = 10;

export const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = useAppSelector(selectUserId);
  const isLogin = useAppSelector(selectIsLogin);
  const role = useAppSelector(selectRole);
  const isAdmin = role === "Admin";
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = Math.max(0, parseInt(searchParams.get("page") || "1", 10) - 1);

  useEffect(() => {
    if (!isLogin || !userId) {
      navigate("/login", { replace: true });
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    async function load() {
      if (isAdmin) {
        const res = await getAllOrdersAPI(page, PAGE_SIZE);
        if (cancelled) return;
        if (res.success) {
          setOrders(res.data.content ?? []);
          setTotalPages(res.data.totalPages ?? 0);
          setError(null);
          return;
        }
        // Backend may not support admin "all orders" (e.g. 400) — fall back to admin's own orders
        const fallback = await getOrdersByUserAPI(userId, page, PAGE_SIZE);
        if (cancelled) return;
        if (fallback.success) {
          setOrders(fallback.data.content ?? []);
          setTotalPages(fallback.data.totalPages ?? 0);
          setError(null);
        } else {
          setError(fallback.error || "Failed to load orders.");
        }
      } else {
        const res = await getOrdersByUserAPI(userId, page, PAGE_SIZE);
        if (cancelled) return;
        if (res.success) {
          setOrders(res.data.content ?? []);
          setTotalPages(res.data.totalPages ?? 0);
          setError(null);
        } else {
          setError(res.error || "Failed to load orders.");
        }
      }
    }
    load()
      .catch(() => {
        if (!cancelled) setError("Failed to load orders.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, isLogin, isAdmin, page, navigate]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage + 1));
    navigate(`/orders?${params.toString()}`);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  if (!isLogin) return null;

  return (
    <div className="flex flex-col gap-20 p-6 w-full h-full">
      <div className="flex flex-col justify-between items-center w-full h-full md:flex-row lg:flex-row">
        <div className="text-3xl font-bold py-4 md:py-0 lg:py-0">{isAdmin ? "All Orders" : "My Orders"}</div>
      </div>

      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-center text-red-600 py-4">Error: {error}</div>}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center text-lg text-gray-600 py-8">
          {isAdmin ? "No orders." : "You have no orders yet."}
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="border border-gray-300 rounded-lg p-4 flex flex-col gap-2 cursor-pointer hover:border-[#5d30ff] hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-sm text-gray-500">#{order.id.slice(0, 8)}</span>
                  <span
                    className={`text-sm font-semibold ${
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
                <div className="text-lg font-bold text-[#5d30ff]">${order.totalAmount.toFixed(2)}</div>
                <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                <div className="text-sm text-gray-600">{order.items.length} item(s)</div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-row gap-2 items-center justify-center lg:justify-end">
              <button
                className="border rounded px-3 py-2 disabled:opacity-50"
                disabled={page === 0}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </button>
              <span className="px-2">
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="border rounded px-3 py-2 disabled:opacity-50"
                disabled={page >= totalPages - 1}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
