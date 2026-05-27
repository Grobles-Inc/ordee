import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { MealSelector } from "./meal-selector";
import { CartSummary } from "./cart-summary";
import { useOrdersStore } from "../stores/orders";
import type { MealWithCategory } from "~/features/meals/api/types";

interface AddItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  meals: MealWithCategory[];
  isLoading?: boolean;
}

export function AddItemsDialog({
  open,
  onOpenChange,
  onSubmit,
  meals,
  isLoading,
}: AddItemsDialogProps) {
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart } =
    useOrdersStore();

  const selectedMealIds = cart.map((item) => item.mealId);

  function handleSelectMeal(meal: MealWithCategory, quantity: number) {
    addToCart({
      mealId: meal.id,
      mealName: meal.name,
      mealPrice: meal.price,
      quantity,
    });
  }

  function handleClose() {
    clearCart();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Items to Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
              <Label>Items to Add</Label>
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
            onClick={onSubmit}
            disabled={isLoading || cart.length === 0}
          >
            {isLoading ? "Adding..." : "Add Items"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
