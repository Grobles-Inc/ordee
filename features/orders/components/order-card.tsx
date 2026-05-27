import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Check,
  CreditCard,
  Trash2,
  Plus,
  Package,
} from "lucide-react";
import {
  getOrderDisplayName,
  getOrderStatus,
  getOrderItemCount,
  formatOrderDate,
  formatPrice,
} from "../api/services";
import type { OrderWithDetails } from "../api/types";

interface OrderCardProps {
  order: OrderWithDetails;
  onView?: (order: OrderWithDetails) => void;
  onMarkServed?: (order: OrderWithDetails) => void;
  onMarkPaid?: (order: OrderWithDetails) => void;
  onAddItems?: (order: OrderWithDetails) => void;
  onDelete?: (order: OrderWithDetails) => void;
}

export function OrderCard({
  order,
  onView,
  onMarkServed,
  onMarkPaid,
  onAddItems,
  onDelete,
}: OrderCardProps) {
  const status = getOrderStatus(order);
  const itemCount = getOrderItemCount(order);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">
            {getOrderDisplayName(order)}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {formatOrderDate(order.date)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status.variant}>{status.label}</Badge>
          {order.toGo && (
            <Badge variant="outline">
              <Package className="mr-1 h-3 w-3" />
              To Go
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(order)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              )}
              {onAddItems && !order.paid && (
                <DropdownMenuItem onClick={() => onAddItems(order)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Items
                </DropdownMenuItem>
              )}
              {onMarkServed && !order.paid && (
                <DropdownMenuItem onClick={() => onMarkServed(order)}>
                  <Check className="mr-2 h-4 w-4" />
                  {order.served ? "Mark Pending" : "Mark Served"}
                </DropdownMenuItem>
              )}
              {onMarkPaid && (
                <DropdownMenuItem onClick={() => onMarkPaid(order)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {order.paid ? "Mark Unpaid" : "Mark Paid"}
                </DropdownMenuItem>
              )}
              {onDelete && !order.paid && (
                <DropdownMenuItem
                  onClick={() => onDelete(order)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Order
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </span>
          <span className="text-lg font-semibold">
            {formatPrice(order.total)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
