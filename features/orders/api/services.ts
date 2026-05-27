import type { Order, OrderWithDetails, OrderItem } from "./types";
import { format } from "date-fns";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function getOrderDisplayName(order: OrderWithDetails): string {
  const tableNum = order.tables?.number ?? "?";
  return `Order #${order.id.slice(0, 8)} (Table ${tableNum})`;
}

export function getOrderStatus(order: Order): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  if (order.paid) {
    return { label: "Paid", variant: "default" };
  }
  if (order.served) {
    return { label: "Served", variant: "secondary" };
  }
  return { label: "Pending", variant: "outline" };
}

export function getOrderItemsTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.mealPrice * item.quantity, 0);
}

export function getOrderItemCount(order: OrderWithDetails): number {
  return (
    order.orderMeals?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  );
}

export function formatOrderDate(date: Date | string | null): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d, yyyy h:mm a");
}

export function filterOrdersByStatus(
  orders: OrderWithDetails[],
  status: "all" | "pending" | "served" | "paid"
): OrderWithDetails[] {
  if (status === "all") return orders;
  return orders.filter((order) => {
    if (status === "paid") return order.paid;
    if (status === "served") return order.served && !order.paid;
    return !order.served && !order.paid;
  });
}

export function filterOrdersBySearch(
  orders: OrderWithDetails[],
  search: string
): OrderWithDetails[] {
  const lowerSearch = search.toLowerCase();
  return orders.filter(
    (order) =>
      order.id.toLowerCase().includes(lowerSearch) ||
      order.tables?.number.toString().includes(lowerSearch) ||
      order.users?.name.toLowerCase().includes(lowerSearch) ||
      order.users?.lastName.toLowerCase().includes(lowerSearch)
  );
}
