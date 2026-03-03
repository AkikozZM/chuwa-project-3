export interface OrderItem {
  productId: string;
  name: string;
  upc?: string;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus = "CREATED" | "CONFIRMED" | "CANCELLED";

export interface IOrder {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

