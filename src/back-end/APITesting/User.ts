import { apiRequest } from "../http";
import type { ApiResult } from "../types";

export type UserRole = "Admin" | "User";

/** Address DTO – matches backend AddressDto (streetLine1, streetLine2, city, stateOrRegion, postalCode, country). */
export interface AddressDto {
  streetLine1?: string;
  streetLine2?: string;
  city?: string;
  stateOrRegion?: string;
  postalCode?: string;
  country?: string;
}

/** Signup request – POST /api/auth/signup. Requires email, username, password; optional role and addresses. */
export interface SignupRequest {
  email: string;
  username: string;
  password: string;
  role?: UserRole;
  shippingAddress?: AddressDto;
  billingAddress?: AddressDto;
}

export type UserData = SignupRequest;

export type UserRecord = {
  id: string;
  email: string;
  username?: string;
  role?: UserRole;
  shippingAddress?: AddressDto;
  billingAddress?: AddressDto;
};

/**
 * Spring Boot auth integration – user-related helpers
 *
 * Sign up: POST /api/auth/signup
 *   Body: { email, username, password, role?, shippingAddress?, billingAddress? }
 *   Rejects if email or username is already used.
 *
 * Forgot password: POST /api/auth/forgot-password?resetBaseUrl=<frontend-url>
 * Reset password: POST /api/auth/reset-password
 */

function isAddressEmpty(addr: AddressDto | undefined): boolean {
  if (!addr) return true;
  return ![
    addr.streetLine1,
    addr.streetLine2,
    addr.city,
    addr.stateOrRegion,
    addr.postalCode,
    addr.country,
  ].some((v) => v != null && String(v).trim() !== "");
}

export async function createUserAPI(user: SignupRequest): Promise<ApiResult<unknown>> {
  const { email, username, password, role, shippingAddress, billingAddress } = user;
  const body: Record<string, unknown> = { email, username, password };
  if (role) {
    body.role = role === "Admin" ? "ADMIN" : "USER";
  }
  if (shippingAddress && !isAddressEmpty(shippingAddress)) {
    body.shippingAddress = shippingAddress;
  }
  if (billingAddress && !isAddressEmpty(billingAddress)) {
    body.billingAddress = billingAddress;
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

/**
 * Forgot password — POST /api/auth/forgot-password?resetBaseUrl=<your-reset-page-url>
 * Body: { email }. No auth header.
 * Backend always returns 200; show generic message. In local dev the reset link may be
 * logged to the backend console (copy into browser).
 */
export async function forgotPasswordAPI(
  email: string
): Promise<ApiResult<{ sent: boolean }>> {
  const resetBaseUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/reset-password`
      : "http://localhost:5173/reset-password";

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

