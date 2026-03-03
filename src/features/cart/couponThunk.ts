import { createAsyncThunk } from "@reduxjs/toolkit";
import { applyCouponAPI } from "../../back-end/APITesting/Coupon.ts";

export const applyCouponThunk = createAsyncThunk(
  "cart/applyCoupon",
  async ({ couponCode, total }: { couponCode: string; total: number }, { rejectWithValue }) => {
    try {
      const res = await applyCouponAPI(couponCode, total);
      if (res.success) {
        return {
          couponCode,
          discountTotal: res.data.discounts,
          discountRate: res.data.discountRate,
        };
      } else {
        return rejectWithValue(res.error || "Failed to apply coupon");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to apply coupon");
    }
  }
);

