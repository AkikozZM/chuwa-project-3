import { orderServiceRequest } from "../http";
import type { ApiResult } from "../types";
import type { IOrder, OrderItem } from "../models/Order";

export interface CreateOrderPayload {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
}

export type OrderListResponse = {
  content: IOrder[];
  totalElements: number;
  totalPages: number;
  number: number;
};

export async function createOrderAPI(
  payload: CreateOrderPayload
): Promise<ApiResult<IOrder>> {
  return orderServiceRequest<IOrder>("/api/orders", {
    method: "POST",
    json: payload,
  });
}

export async function getOrderAPI(id: string): Promise<ApiResult<IOrder>> {
  return orderServiceRequest<IOrder>(`/api/orders/${encodeURIComponent(id)}`, {
    method: "GET",
  });
}

export async function getOrdersByUserAPI(
  userId: string,
  page: number,
  pageSize: number
): Promise<ApiResult<OrderListResponse>> {
  const q = new URLSearchParams({
    userId,
    page: String(page),
    pageSize: String(pageSize),
  });
  return orderServiceRequest<OrderListResponse>(`/api/orders?${q.toString()}`, {
    method: "GET",
  });
}

/** Get all orders (admin). GET /api/orders/admin/all */
export async function getAllOrdersAPI(
  page: number,
  pageSize: number
): Promise<ApiResult<OrderListResponse>> {
  const q = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  return orderServiceRequest<OrderListResponse>(`/api/orders/admin/all?${q.toString()}`, {
    method: "GET",
  });
}

export async function updateOrderAPI(
  id: string,
  payload: CreateOrderPayload
): Promise<ApiResult<IOrder>> {
  return orderServiceRequest<IOrder>(`/api/orders/${encodeURIComponent(id)}`, {
    method: "PUT",
    json: payload,
  });
}

export async function cancelOrderAPI(
  id: string
): Promise<ApiResult<IOrder>> {
  return orderServiceRequest<IOrder>(
    `/api/orders/${encodeURIComponent(id)}/cancel`,
    { method: "POST" }
  );
}

/**
 * Confirm order — POST /api/orders/{id}/confirm
 */
export async function confirmOrderAPI(
  id: string
): Promise<ApiResult<IOrder>> {
  return orderServiceRequest<IOrder>(
    `/api/orders/${encodeURIComponent(id)}/confirm`,
    { method: "POST" }
  );
}

