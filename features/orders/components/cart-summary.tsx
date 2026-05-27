import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Trash2, Minus, Plus } from "lucide-react";
import { formatPrice } from "../api/services";
import type { OrderItem } from "../api/types";

interface CartSummaryProps {
  items: OrderItem[];
  onUpdateQuantity: (mealId: string, quantity: number) => void;
  onRemove: (mealId: string) => void;
  readonly?: boolean;
}

export function CartSummary({
  items,
  onUpdateQuantity,
  onRemove,
  readonly,
}: CartSummaryProps) {
  const total = items.reduce(
    (sum, item) => sum + item.mealPrice * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No items in cart
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.mealId}
          className="flex items-center justify-between gap-2"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.mealName}</p>
            <p className="text-xs text-muted-foreground">
              {formatPrice(item.mealPrice)} each
            </p>
          </div>
          {readonly ? (
            <span className="text-sm">x{item.quantity}</span>
          ) : (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() =>
                  onUpdateQuantity(item.mealId, item.quantity - 1)
                }
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() =>
                  onUpdateQuantity(item.mealId, item.quantity + 1)
                }
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => onRemove(item.mealId)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
          <span className="text-sm font-medium w-20 text-right">
            {formatPrice(item.mealPrice * item.quantity)}
          </span>
        </div>
      ))}

      <div className="border-t pt-3 flex items-center justify-between font-semibold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
