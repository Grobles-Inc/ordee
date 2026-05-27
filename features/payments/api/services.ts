import type { OrderWithDetails } from "./types";
import { format } from "date-fns";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatPaymentDate(date: Date | string | null): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d, yyyy h:mm a");
}

export function getPaymentSummary(orders: OrderWithDetails[]) {
  const total = orders.reduce((sum, order) => sum + order.total, 0);
  const count = orders.length;
  return { total, count };
}

export function filterPaymentsBySearch(
  orders: OrderWithDetails[],
  search: string
): OrderWithDetails[] {
  const lowerSearch = search.toLowerCase();
  return orders.filter(
    (order) =>
      order.id.toLowerCase().includes(lowerSearch) ||
      order.tables?.number.toString().includes(lowerSearch)
  );
}
