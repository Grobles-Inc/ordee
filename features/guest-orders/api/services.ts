import type { GuestOrderItem } from "./types";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function getOrderItemsTotal(items: GuestOrderItem[]): number {
  return items.reduce((sum, item) => sum + item.mealPrice * item.quantity, 0);
}

export function getOrderItemCount(items: GuestOrderItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
