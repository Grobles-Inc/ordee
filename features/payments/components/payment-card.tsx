import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Eye, Receipt } from "lucide-react";
import { formatPrice, formatPaymentDate } from "../api/services";
import type { OrderWithDetails } from "../api/types";

interface PaymentCardProps {
  order: OrderWithDetails;
  onViewReceipt: (order: OrderWithDetails) => void;
}

export function PaymentCard({ order, onViewReceipt }: PaymentCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">
            Order #{order.id.slice(0, 8)}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {formatPaymentDate(order.date)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onViewReceipt(order)}
        >
          <Receipt className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Table {order.tables?.number ?? "?"}
          </span>
          <span className="text-lg font-semibold">
            {formatPrice(order.total)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
