import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { tableFormSchema, type TableFormValues } from "../api/schemas";
import type { Table } from "../api/types";

interface TableFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TableFormValues) => void;
  table?: Table | null;
  isLoading?: boolean;
  existingNumbers?: number[];
}

export function TableFormDialog({
  open,
  onOpenChange,
  onSubmit,
  table,
  isLoading,
  existingNumbers = [],
}: TableFormDialogProps) {
  const isEditing = !!table;

  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: {
      number: 1,
    },
  });

  useEffect(() => {
    if (table) {
      form.reset({ number: table.number });
    } else {
      const nextNumber = existingNumbers.length > 0
        ? Math.max(...existingNumbers) + 1
        : 1;
      form.reset({ number: nextNumber });
    }
  }, [table, form, existingNumbers]);

  function handleSubmit(data: TableFormValues) {
    if (!isEditing && existingNumbers.includes(data.number)) {
      form.setError("number", { message: "Table number already exists" });
      return;
    }
    onSubmit(data);
    if (!isEditing) {
      form.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Table" : "Add Table"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="999"
                      placeholder="1"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? isEditing
                    ? "Saving..."
                    : "Creating..."
                  : isEditing
                    ? "Save Changes"
                    : "Create Table"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
