import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { getOrderDisplayName, formatPrice } from "../api/services";
import type { OrderWithDetails } from "../api/types";

interface DeleteOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderWithDetails | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteOrderDialog({
  open,
  onOpenChange,
  order,
  onConfirm,
  isLoading,
}: DeleteOrderDialogProps) {
  if (!order) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Order</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this order? This will restore meal
            quantities and free up the table.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Order:</span>{" "}
            {getOrderDisplayName(order)}
          </p>
          <p>
            <span className="font-medium">Total:</span>{" "}
            {formatPrice(order.total)}
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete Order"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
