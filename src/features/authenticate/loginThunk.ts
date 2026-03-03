import { createAsyncThunk } from "@reduxjs/toolkit";
import { setIsLogin, setRole, setUserId } from "./authenticate";
import { loginUser } from "../../back-end/APITesting/Auth.ts";

/** Normalize backend role (e.g. "ADMIN", "USER", "ROLE_ADMIN") to "Admin" | "User". */
function normalizeRole(role: string | undefined): "Admin" | "User" {
  if (!role) return "User";
  const r = role.toLowerCase().replace(/^role_/, "");
  return r === "admin" ? "Admin" : "User";
}

/** Get app role from backend user.roles array (e.g. ["USER"] or ["ADMIN"]). */
function roleFromUser(user: { roles?: string[] }): "Admin" | "User" {
  const roles = user?.roles;
  if (!Array.isArray(roles) || roles.length === 0) return "User";
  const admin = roles.find((r) => r.toLowerCase().replace(/^role_/, "") === "admin");
  return normalizeRole(admin ?? roles[0]);
}

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const loginRes = await loginUser(email, password);
      if (!loginRes.success) {
        return rejectWithValue("Login failed");
      }
      dispatch(setIsLogin(true));
      dispatch(setUserId(loginRes.data.user.id));
      const role = roleFromUser(loginRes.data.user);
      dispatch(setRole(role));
      return loginRes.data;
    } catch (error) {
      return rejectWithValue("Login failed");
    }
  }
);