import { paymentServiceRequest } from "../http";
import type { ApiResult } from "../types";
import type { IPayment } from "../models/Payment";

export interface SubmitPaymentPayload {
  orderId: string;
  userId: string;
  amount: number;
  currency?: string;
}

export interface UpdatePaymentPayload {
  status: string; // e.g. "FAILED"
}

function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}

/**
 * Submit payment — POST /api/payments
 * Sends Idempotency-Key header (required). Same key → same payment (no double charge).
 * Pass idempotencyKey to reuse a key (e.g. for retries so the same request isn't charged twice).
 */
export async function submitPaymentAPI(
  payload: SubmitPaymentPayload,
  idempotencyKey?: string
): Promise<ApiResult<IPayment>> {
  const key = idempotencyKey ?? generateIdempotencyKey();
  return paymentServiceRequest<IPayment>("/api/payments", {
    method: "POST",
    json: payload,
    headers: {
      "Idempotency-Key": key,
    },
  });
}

/**
 * Payment lookup — GET /api/payments/{id}
 */
export async function getPaymentAPI(id: string): Promise<ApiResult<IPayment>> {
  return paymentServiceRequest<IPayment>(`/api/payments/${encodeURIComponent(id)}`, {
    method: "GET",
  });
}

/**
 * Update payment — PUT /api/payments/{id}
 * Body: e.g. { status: "FAILED" }. Use to mark payment as failed manually (e.g. admin).
 */
export async function updatePaymentAPI(
  id: string,
  payload: UpdatePaymentPayload
): Promise<ApiResult<IPayment>> {
  return paymentServiceRequest<IPayment>(`/api/payments/${encodeURIComponent(id)}`, {
    method: "PUT",
    json: payload,
  });
}

/**
 * Reverse payment (refund) — POST /api/payments/{id}/refund
 * Idempotency-Key required. Same key → same result (no double refund).
 * Pass idempotencyKey to reuse (e.g. for retries).
 */
export async function refundPaymentAPI(
  paymentId: string,
  idempotencyKey?: string
): Promise<ApiResult<IPayment>> {
  const key = idempotencyKey ?? generateIdempotencyKey();
  return paymentServiceRequest<IPayment>(
    `/api/payments/${encodeURIComponent(paymentId)}/refund`,
    {
      method: "POST",
      headers: {
        "Idempotency-Key": key,
      },
    }
  );
}
