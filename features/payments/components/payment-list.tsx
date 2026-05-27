import { Receipt } from "lucide-react";
import { PaymentCard } from "./payment-card";
import type { OrderWithDetails } from "../api/types";

interface PaymentListProps {
  orders: OrderWithDetails[];
  onViewReceipt: (order: OrderWithDetails) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function PaymentList({
  orders,
  onViewReceipt,
  isLoading,
  emptyMessage = "No payments found",
}: PaymentListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading payments...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <PaymentCard
          key={order.id}
          order={order}
          onViewReceipt={onViewReceipt}
        />
      ))}
    </div>
  );
}
