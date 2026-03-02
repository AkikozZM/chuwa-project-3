import { createAsyncThunk } from "@reduxjs/toolkit";
import { setIsLogin, setRole } from "./authenticate";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const userRes = await findUserAPI(email);
      if (!userRes.success) {
        return rejectWithValue("User not found");
      }
      const loginRes = await loginUser(email, password);
      if (!loginRes.success) {
        return rejectWithValue("Login failed");
      }
      dispatch(setIsLogin(true));
      dispatch(setRole(userRes.data.user.role));
      return loginRes.data;
    } catch (error) {
      return rejectWithValue("Login failed");
    }
  }
);