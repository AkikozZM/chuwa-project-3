import { apiRequest } from "../http";
import type { ApiResult } from "../types";

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  user: {
    id: string;
    email: string;
    roles: string[];
  };
};

/**
 * Spring Boot auth integration
 *
 * - Login: POST /api/auth/login  -> { accessToken, tokenType, user: { id, email, roles } }
 * - Other secured endpoints expect: Authorization: Bearer <accessToken>
 */

export async function loginUser(
  email: string,
  password: string
): Promise<ApiResult<LoginResponse>> {
  const res = await apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    json: { email, password },
  });

  if (res.success) {
    try {
      localStorage.setItem("authToken", res.data.accessToken);
    } catch {
      // ignore storage failures
    }
  }

  return res;
}

export function logoutUser(): void {
  // If your Spring Boot backend has a logout endpoint, you can call it here.
  // For stateless JWT, removing the token on the client is typically enough.

  try {
    localStorage.removeItem("authToken");
  } catch {
    // ignore storage failures
  }
}

