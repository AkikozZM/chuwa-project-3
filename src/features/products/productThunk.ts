import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllProductAPI } from "../../back-end/APITesting/Product.ts";

export const fetchProductsThunk = createAsyncThunk(
  "fetchProductsThunk",
  async ({ page, sort }: { page: number; sort: string }, thunkAPI) => {
    try {
      const response = await getAllProductAPI(page, 10, sort);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error || "Cannot get all products.");
      }
      return response.data;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue("Cannot get all products.");
    }
  }
);
