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
import type { Category } from "../api/types";

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onConfirm: () => void;
  isLoading?: boolean;
  hasMeals?: boolean;
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  onConfirm,
  isLoading,
  hasMeals,
}: DeleteCategoryDialogProps) {
  if (!category) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            {hasMeals ? (
              <>
                <span className="font-semibold">{category.name}</span> has
                meals assigned to it. You must reassign or delete those meals
                before deleting this category.
              </>
            ) : (
              <>
                Are you sure you want to delete{" "}
                <span className="font-semibold">{category.name}</span>? This
                action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {!hasMeals && (
            <AlertDialogAction
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete Category"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
