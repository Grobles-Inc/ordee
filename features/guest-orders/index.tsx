import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { ShoppingCart } from "lucide-react";
import { GuestCart } from "./components/guest-cart";
import { MealSelector } from "~/features/orders/components/meal-selector";
import { useCreateGuestOrder } from "./api/queries";
import { useMealsByTenant } from "~/features/meals/api/queries";
import { useTablesByTenant } from "~/features/tables/api/queries";
import { useAuth } from "~/hooks/use-auth";
import type { GuestOrderItem } from "./api/types";
import type { MealWithCategory } from "~/features/meals/api/types";

export function GuestOrdersFeature() {
  const { profile } = useAuth();
  const tenantId = profile?.idTenant;
  const guestId = profile?.id;

  const [selectedTable, setSelectedTable] = useState<string>("");
  const [toGo, setToGo] = useState(false);
  const [cart, setCart] = useState<GuestOrderItem[]>([]);

  const { data: meals = [] } = useMealsByTenant(tenantId ?? "");
  const { data: tables = [] } = useTablesByTenant(tenantId ?? "");
  const createOrder = useCreateGuestOrder();

  const availableTables = tables.filter((t) => !t.status && !t.disabled);
  const selectedMealIds = cart.map((item) => item.mealId);

  function handleSelectMeal(meal: MealWithCategory, quantity: number) {
    setCart((prev) => {
      const existing = prev.find((i) => i.mealId === meal.id);
      if (existing) {
        return prev.map((i) =>
          i.mealId === meal.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          mealId: meal.id,
          mealName: meal.name,
          mealPrice: meal.price,
          quantity,
        },
      ];
    });
  }

  function handleUpdateQuantity(mealId: string, quantity: number) {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.mealId !== mealId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.mealId === mealId ? { ...i, quantity } : i))
      );
    }
  }

  function handleRemove(mealId: string) {
    setCart((prev) => prev.filter((i) => i.mealId !== mealId));
  }

  function handleSubmit() {
    if (!selectedTable || cart.length === 0 || !guestId || !tenantId) return;

    createOrder.mutate(
      {
        data: { tableId: selectedTable, items: cart, toGo },
        guestId,
        tenantId,
      },
      {
        onSuccess: () => {
          setCart([]);
          setSelectedTable("");
          setToGo(false);
        },
      }
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Place Order</h1>
        <p className="text-muted-foreground">Select items and place your order</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Table</Label>
          <Select value={selectedTable} onValueChange={setSelectedTable}>
            <SelectTrigger>
              <SelectValue placeholder="Select a table" />
            </SelectTrigger>
            <SelectContent>
              {availableTables.length === 0 ? (
                <SelectItem value="none" disabled>
                  No tables available
                </SelectItem>
              ) : (
                availableTables.map((table) => (
                  <SelectItem key={table.id} value={table.id}>
                    Table {table.number}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Order Type</Label>
          <div className="flex items-center gap-2">
            <Switch checked={toGo} onCheckedChange={setToGo} />
            <span className="text-sm">{toGo ? "To Go" : "Dine In"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Select Items</Label>
        <MealSelector
          meals={meals}
          onSelect={handleSelectMeal}
          selectedMealIds={selectedMealIds}
        />
      </div>

      {cart.length > 0 && (
        <div className="space-y-2">
          <Label>Your Order</Label>
          <GuestCart
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
          />
        </div>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={handleSubmit}
        disabled={createOrder.isPending || !selectedTable || cart.length === 0}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {createOrder.isPending ? "Placing Order..." : "Place Order"}
      </Button>
    </div>
  );
}

export { GuestCart } from "./components/guest-cart";
export * from "./api/queries";
export * from "./api/types";
