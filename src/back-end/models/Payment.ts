export type PaymentStatus = "COMPLETED" | "FAILED" | "REFUNDED" | "PENDING";

export interface IPayment {
  id: string;
  orderId?: string;
  userId?: string;
  amount: number;
  currency?: string;
  status: PaymentStatus;
  idempotencyKey?: string;
  refundIdempotencyKey?: string;
  createdAt?: string;
  updatedAt?: string;
}
