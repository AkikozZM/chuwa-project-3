import { itemServiceRequest } from "../http";
import type { ApiResult } from "../types";
import type { IProduct } from "../models/Product";

/** Item-service may return "id"; we normalize to "_id" and ensure "upc" for the rest of the app. */
function toProduct(p: IProduct & { id?: string; upc?: string }): IProduct {
  const id = p._id ?? p.id ?? "";
  const upc = p.upc ?? "";
  return { ...p, _id: id, upc } as IProduct;
}

/** Shape the app expects (productSlice, thunk). */
export type ProductListResponse = {
  products: IProduct[];
  page: number;
  pages: number;
  total?: number;
};

/**
 * Item-service (port 8082) REST API:
 *
 * GET  /api/products                    ?page=1&pageSize=10&sort=lastAdded  → Paginated (content, totalElements, totalPages)
 * GET  /api/products/{id}               → One product or 404
 * GET  /api/products/category/{category} ?page=1&pageSize=10                 → Paginated by category
 * POST /api/products                    Product JSON (no id)                 → 201 + created product
 * PUT  /api/products/{id}               Full product JSON                    → Updated product or 404
 * DELETE /api/products/{id}             → 204 or 404
 */

/** Spring Page-style response from item-service. */
type SpringPageResponse = {
  content: IProduct[];
  totalElements: number;
  totalPages: number;
  number?: number;
};

export async function getAllProductAPI(
  page: number,
  pageSize: number,
  sort: string
): Promise<ApiResult<ProductListResponse>> {
  // Spring Data uses 0-based page index
  const pageIndex = Math.max(0, page - 1);
  const q = new URLSearchParams({
    page: String(pageIndex),
    pageSize: String(pageSize),
    sort,
  });
  const res = await itemServiceRequest<SpringPageResponse>(
    `/api/products?${q.toString()}`,
    { method: "GET" }
  );
  if (!res.success) return res;
  return {
    success: true,
    data: {
      products: (res.data.content ?? []).map(toProduct),
      page: res.data.number ?? pageIndex,
      pages: res.data.totalPages ?? 1,
      total: res.data.totalElements,
    },
  };
}

export async function findProductAPI(
  id: string
): Promise<ApiResult<{ product: IProduct }>> {
  const res = await itemServiceRequest<IProduct>(
    `/api/products/${encodeURIComponent(id)}`,
    { method: "GET" }
  );
  if (!res.success) return res;
  return { success: true, data: { product: toProduct(res.data) } };
}

export async function getProductsByCategoryAPI(
  category: string,
  page: number,
  pageSize: number
): Promise<ApiResult<ProductListResponse>> {
  const pageIndex = Math.max(0, page - 1);
  const q = new URLSearchParams({
    page: String(pageIndex),
    pageSize: String(pageSize),
  });
  const res = await itemServiceRequest<SpringPageResponse>(
    `/api/products/category/${encodeURIComponent(category)}?${q.toString()}`,
    { method: "GET" }
  );
  if (!res.success) return res;
  return {
    success: true,
    data: {
      products: (res.data.content ?? []).map(toProduct),
      page: res.data.number ?? pageIndex,
      pages: res.data.totalPages ?? 1,
      total: res.data.totalElements,
    },
  };
}

export async function createProductAPI(
  name: string,
  description: string,
  category: string,
  price: number,
  stock: number,
  upc: string,
  imageUrl?: string
): Promise<ApiResult<{ product: IProduct }>> {
  const body: Record<string, unknown> = {
    name,
    description,
    category,
    price: Number(price),
    stock: Number(stock),
    upc: String(upc).trim(),
  };
  if (imageUrl != null && String(imageUrl).trim() !== "") {
    body.imageUrl = imageUrl.trim();
  }
  const res = await itemServiceRequest<IProduct>("/api/products", {
    method: "POST",
    json: body,
  });
  if (!res.success) return res;
  return { success: true, data: { product: toProduct(res.data) } };
}

export async function updateProductAPI(
  id: string,
  update: Partial<Omit<IProduct, "_id">> | IProduct
): Promise<ApiResult<{ product: IProduct }>> {
  const body = "_id" in update ? update : { _id: id, ...update };
  const res = await itemServiceRequest<IProduct>(
    `/api/products/${encodeURIComponent(id)}`,
    { method: "PUT", json: body }
  );
  if (!res.success) return res;
  return { success: true, data: { product: toProduct(res.data) } };
}

export async function deleteProductAPI(id: string): Promise<ApiResult<void>> {
  return itemServiceRequest<void>(
    `/api/products/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );
}
