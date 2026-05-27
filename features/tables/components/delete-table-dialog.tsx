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
import { getTableDisplayName } from "../api/services";
import type { Table } from "../api/types";

interface DeleteTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: Table | null;
  onConfirm: () => void;
  isLoading?: boolean;
  isOccupied?: boolean;
}

export function DeleteTableDialog({
  open,
  onOpenChange,
  table,
  onConfirm,
  isLoading,
  isOccupied,
}: DeleteTableDialogProps) {
  if (!table) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Table</AlertDialogTitle>
          <AlertDialogDescription>
            {isOccupied ? (
              <>
                <span className="font-semibold">
                  {getTableDisplayName(table)}
                </span>{" "}
                is currently occupied. You must close the current order before
                deleting this table.
              </>
            ) : (
              <>
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {getTableDisplayName(table)}
                </span>
                ? This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {!isOccupied && (
            <AlertDialogAction
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete Table"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
