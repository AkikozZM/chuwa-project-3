import type { ApiFailure, ApiResult } from "./types";

function getApiBaseUrl() {
  const fromEnv = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  return (fromEnv ?? "http://localhost:8081").replace(/\/$/, "");
}

/**
 * Item-service (products) runs on a different port.
 * Override with VITE_ITEM_SERVICE_URL (e.g. http://localhost:8082).
 */
export function getItemServiceBaseUrl() {
  const fromEnv = (import.meta as any).env?.VITE_ITEM_SERVICE_URL as string | undefined;
  return (fromEnv ?? "http://localhost:8082").replace(/\/$/, "");
}

/**
 * Order-service runs on its own port.
 * Override with VITE_ORDER_SERVICE_URL (e.g. http://localhost:8083).
 */
export function getOrderServiceBaseUrl() {
  const fromEnv = (import.meta as any).env?.VITE_ORDER_SERVICE_URL as string | undefined;
  return (fromEnv ?? "http://localhost:8083").replace(/\/$/, "");
}

/**
 * Payment-service runs on its own port.
 * Override with VITE_PAYMENT_SERVICE_URL (e.g. http://localhost:8084).
 */
export function getPaymentServiceBaseUrl() {
  const fromEnv = (import.meta as any).env?.VITE_PAYMENT_SERVICE_URL as string | undefined;
  return (fromEnv ?? "http://localhost:8084").replace(/\/$/, "");
}

function toFailure(error: unknown, status?: number): ApiFailure {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "Request failed";
  return { success: false, error: message, status };
}

async function request<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<ApiResult<T>> {
  try {
    const headers = new Headers(init?.headers);
    if (init?.json !== undefined) {
      headers.set("Content-Type", "application/json");
    }
    try {
      const token = localStorage.getItem("authToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
    } catch {
      // ignore
    }

    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
      body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
    });

    if (res.status === 204) {
      return { success: true, data: undefined as T };
    }

    const contentType = res.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

    if (!res.ok) {
      const message =
        (payload && typeof payload === "object" && "message" in payload && (payload as any).message) ||
        (typeof payload === "string" && payload) ||
        `HTTP ${res.status}`;
      return { success: false, error: String(message), status: res.status };
    }

    return { success: true, data: payload as T };
  } catch (e) {
    return toFailure(e);
  }
}

/** Auth service (e.g. port 8081). */
export async function apiRequest<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<ApiResult<T>> {
  return request<T>(getApiBaseUrl(), path, init);
}

/** Item-service / products (e.g. port 8082). */
export async function itemServiceRequest<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<ApiResult<T>> {
  return request<T>(getItemServiceBaseUrl(), path, init);
}

/** Order-service (e.g. port 8083). */
export async function orderServiceRequest<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<ApiResult<T>> {
  return request<T>(getOrderServiceBaseUrl(), path, init);
}

/** Payment-service (e.g. port 8084). */
export async function paymentServiceRequest<T>(
  path: string,
  init?: RequestInit & { json?: unknown; headers?: HeadersInit }
): Promise<ApiResult<T>> {
  return request<T>(getPaymentServiceBaseUrl(), path, init);
}

