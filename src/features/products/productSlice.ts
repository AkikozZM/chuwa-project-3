import { createSlice } from "@reduxjs/toolkit";
import type { IProduct } from "../../back-end/models/Product";
import type { RootState } from "../../app/store";
import { fetchProductsThunk } from "./productThunk";

interface ProductsState {
  products: IProduct[];
  currentPage: number;
  totalPages: number;
  sortOption: string;
  search: string;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  currentPage: 1,
  totalPages: 1,
  sortOption: "lastAdded",
  search: "",
  loading: false,
  error: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.pages;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setProducts,
  setCurrentPage,
  setTotalPages,
  setSortOption,
  setSearch,
  setLoading,
  setError,
} = productsSlice.actions;

export const selectProducts = (state: RootState) => state.products.products;
export const selectCurrentPage = (state: RootState) =>
  state.products.currentPage;
export const selectTotalPage = (state: RootState) => state.products.totalPages;
export const selectSortOption = (state: RootState) => state.products.sortOption;
export const selectSearch = (state: RootState) => state.products.search;
export const selectLoading = (state: RootState) => state.products.loading;
export const selectError = (state: RootState) => state.products.error;

export default productsSlice.reducer;
