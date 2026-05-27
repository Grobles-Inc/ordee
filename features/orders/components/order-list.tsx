import { ClipboardList } from "lucide-react";
import { OrderCard } from "./order-card";
import type { OrderWithDetails } from "../api/types";

interface OrderListProps {
  orders: OrderWithDetails[];
  onView?: (order: OrderWithDetails) => void;
  onMarkServed?: (order: OrderWithDetails) => void;
  onMarkPaid?: (order: OrderWithDetails) => void;
  onAddItems?: (order: OrderWithDetails) => void;
  onDelete?: (order: OrderWithDetails) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function OrderList({
  orders,
  onView,
  onMarkServed,
  onMarkPaid,
  onAddItems,
  onDelete,
  isLoading,
  emptyMessage = "No orders found",
}: OrderListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onView={onView}
          onMarkServed={onMarkServed}
          onMarkPaid={onMarkPaid}
          onAddItems={onAddItems}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
