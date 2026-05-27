import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { formatPrice, formatPaymentDate } from "../api/services";
import type { OrderWithDetails } from "../api/types";

interface ReceiptProps {
  order: OrderWithDetails;
}

export function Receipt({ order }: ReceiptProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Receipt</CardTitle>
        <p className="text-sm text-muted-foreground">
          Order #{order.id.slice(0, 8)}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Date</p>
            <p>{formatPaymentDate(order.date)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Table</p>
            <p>Table {order.tables?.number ?? "?"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p>{order.toGo ? "To Go" : "Dine In"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="text-green-600 font-medium">Paid</p>
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
