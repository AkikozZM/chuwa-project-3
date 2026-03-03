import { apiRequest } from "../http";
import type { ApiResult } from "../types";

export type ApplyCouponResponse = {
  discounts: number;
  discountRate: number;
};

/**
 * BACKEND (Spring Boot) REQUIRED
 * Suggested endpoint:
 * - POST `/api/coupons/apply` -> { couponCode, total } => { discounts, discountRate }
 */
export async function applyCouponAPI(
  couponCode: string,
  total: number
): Promise<ApiResult<ApplyCouponResponse>> {
  return apiRequest<ApplyCouponResponse>("/api/coupons/apply", {
    method: "POST",
    json: { couponCode, total },
  });
}

