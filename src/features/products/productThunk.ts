import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllProductAPI } from "../../back-end/APITesting/Product";

export const fetchProductsThunk = createAsyncThunk(
  "fetchProductsThunk",
  async ({ page, sort }: { page: number; sort: string }, thunkAPI) => {
    try {
      const response = await getAllProductAPI(page, 10, sort);
      return response.data;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue("Cannot get all products.");
    }
  }
);
