import { apiRequest } from "../http";
import type { ApiResult } from "../types";

export type UserRole = "Admin" | "User";

export type UserData = {
  email: string;
  password: string;
  role?: UserRole;
};

export type UserRecord = {
  id: string;
  email: string;
  role?: UserRole;
};

/**
 * Spring Boot auth integration – user-related helpers
 *
 * Implemented backend endpoints:
 * - Sign up:        POST /api/auth/signup
 *   Body:           { "email": string, "password": string, "role"?: string }
 *   role:           "ADMIN" or "USER" (backend typically expects uppercase)
 *
 * - Forgot password: POST /api/auth/forgot-password?resetBaseUrl=<frontend-url>
 *   Body:            { "email": string }
 *
 * - Reset password: POST /api/auth/reset-password
 *   Body:           { "token": string, "newPassword": string }
 */

export async function createUserAPI(user: UserData): Promise<ApiResult<unknown>> {
  const { email, password, role } = user;
  const body: Record<string, string> = { email, password };
  if (role) {
    body.role = role === "Admin" ? "ADMIN" : "USER";
  }
  return apiRequest<unknown>("/api/auth/signup", {
    method: "POST",
    json: body,
  });
}

// Optional helper, not currently wired up to the provided Spring Boot API.
export async function findUserAPI(_: string): Promise<ApiResult<{ user: UserRecord }>> {
  return {
    success: false,
    error: "findUserAPI is not implemented in the current Spring Boot backend.",
  };
}

export async function forgotPasswordAPI(
  email: string
): Promise<ApiResult<{ sent: boolean }>> {
  const resetBaseUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/reset-password`
      : "http://localhost:3000/reset-password";

  const q = new URLSearchParams({ resetBaseUrl });

  return apiRequest<{ sent: boolean }>(`/api/auth/forgot-password?${q.toString()}`, {
    method: "POST",
    json: { email },
  });
}

export async function updatePasswordAPI(
  token: string,
  newPassword: string
): Promise<ApiResult<{ updated: boolean }>> {
  return apiRequest<{ updated: boolean }>("/api/auth/reset-password", {
    method: "POST",
    json: { token, newPassword },
  });
}

