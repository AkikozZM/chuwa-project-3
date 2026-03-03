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

