import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { MealSelector } from "./meal-selector";
import { CartSummary } from "./cart-summary";
import { useOrdersStore } from "../stores/orders";
import type { MealWithCategory } from "~/features/meals/api/types";
import type { Table } from "~/features/tables/api/types";

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (idTable: string, toGo: boolean) => void;
  meals: MealWithCategory[];
  tables: Table[];
  isLoading?: boolean;
}

export function CreateOrderDialog({
  open,
  onOpenChange,
  onSubmit,
  meals,
  tables,
  isLoading,
}: CreateOrderDialogProps) {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [toGo, setToGo] = useState(false);

  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart } =
    useOrdersStore();

  const availableTables = tables.filter((t) => !t.status && !t.disabled);
  const selectedMealIds = cart.map((item) => item.mealId);

  function handleSelectMeal(meal: MealWithCategory, quantity: number) {
    addToCart({
      mealId: meal.id,
      mealName: meal.name,
      mealPrice: meal.price,
      quantity,
    });
  }

  function handleSubmit() {
    if (!selectedTable || cart.length === 0) return;
    onSubmit(selectedTable, toGo);
  }

  function handleClose() {
    clearCart();
    setSelectedTable("");
    setToGo(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
              <Label>Order Summary</Label>
              <CartSummary
                items={cart}
                onUpdateQuantity={updateCartQuantity}
                onRemove={removeFromCart}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !selectedTable || cart.length === 0}
          >
            {isLoading ? "Creating..." : "Create Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
