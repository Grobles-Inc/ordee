import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import {
  getOrderStatus,
  formatOrderDate,
  formatPrice,
} from "../api/services";
import type { OrderWithDetails } from "../api/types";

interface OrderDetailsProps {
  order: OrderWithDetails;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const status = getOrderStatus(order);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Order Details</CardTitle>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Order ID</p>
            <p className="font-mono">{order.id.slice(0, 8)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date</p>
            <p>{formatOrderDate(order.date)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Table</p>
            <p>Table {order.tables?.number ?? "?"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p>{order.toGo ? "To Go" : "Dine In"}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-3">Items</h4>
          <div className="space-y-2">
            {order.orderMeals?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {item.quantity}x {item.meals?.name ?? "Unknown"}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {formatPrice((item.meals?.price ?? 0) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
