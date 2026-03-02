import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { applyCouponThunk } from "./couponThunk";

interface CouponState {
  couponCode: string;
  discountTotal: number;
  discountRate: number;
  discountApplied: boolean;
}

const initialState: CouponState = {
  couponCode: "",
  discountTotal: 0,
  discountRate: 0,
  discountApplied: false,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    resetCoupon: (state) => {
      state.couponCode = "";
      state.discountTotal = 0;
      state.discountRate = 0;
      state.discountApplied = false;
    },
    setCouponCode: (state, action) => {
      state.couponCode = action.payload;
    },
    setDiscountTotal: (state, action) => {
      state.discountTotal = action.payload;
    },
    setDiscountRate: (state, action) => {
      state.discountRate = action.payload;
    },
    setDiscountApplied: (state, action) => {
      state.discountApplied = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(applyCouponThunk.fulfilled, (state, action) => {
      state.couponCode = action.payload.couponCode;
      state.discountTotal = action.payload.discountTotal;
      state.discountRate = action.payload.discountRate;
      state.discountApplied = true;
    });
  },
});

export const {
  resetCoupon,
  setCouponCode,
  setDiscountApplied,
  setDiscountRate,
  setDiscountTotal,
} = couponSlice.actions;

export const selectCouponCode = (state: RootState) => state.coupon.couponCode;
export const selectDiscountTotal = (state: RootState) =>
  state.coupon.discountTotal;
export const selectDiscountRate = (state: RootState) =>
  state.coupon.discountRate;
export const selectDiscountApplied = (state: RootState) =>
  state.coupon.discountApplied;

export default couponSlice.reducer;
