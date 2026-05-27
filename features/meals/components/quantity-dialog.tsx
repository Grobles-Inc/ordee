import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import type { Meal } from "../api/types";

interface QuantityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meal: Meal | null;
  onSubmit: (quantity: number) => void;
  isLoading?: boolean;
}

export function QuantityDialog({
  open,
  onOpenChange,
  meal,
  onSubmit,
  isLoading,
}: QuantityDialogProps) {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (meal) {
      setQuantity(meal.quantity);
    }
  }, [meal]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(quantity);
  }

  if (!meal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>Update Quantity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">{meal.name}</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            />
            <p className="text-sm text-muted-foreground">
              Current: {meal.quantity} units
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Quantity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
