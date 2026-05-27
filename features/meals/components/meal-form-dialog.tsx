import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ImageUpload } from "./image-upload";
import { mealFormSchema, type MealFormValues } from "../api/schemas";
import type { MealWithCategory } from "../api/types";
import type { Category } from "~/features/categories/api/types";

interface MealFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MealFormValues, imageFile: File | null) => void;
  meal?: MealWithCategory | null;
  categories: Category[];
  isLoading?: boolean;
}

export function MealFormDialog({
  open,
  onOpenChange,
  onSubmit,
  meal,
  categories,
  isLoading,
}: MealFormDialogProps) {
  const isEditing = !!meal;
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      name: "",
      price: 0,
      quantity: 0,
      idCategory: "",
    },
  });

  useEffect(() => {
    if (meal) {
      form.reset({
        name: meal.name,
        price: meal.price,
        quantity: meal.quantity,
        idCategory: meal.idCategory,
      });
    } else {
      form.reset({
        name: "",
        price: 0,
        quantity: 0,
        idCategory: "",
      });
      setImageFile(null);
    }
  }, [meal, form]);

  function handleSubmit(data: MealFormValues) {
    onSubmit(data, imageFile);
    if (!isEditing) {
      form.reset();
      setImageFile(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Meal" : "Add Meal"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Meal name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
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
            </div>
            <FormField
              control={form.control}
              name="idCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>Image</FormLabel>
              <ImageUpload
                value={meal?.imageUrl}
                onChange={setImageFile}
                disabled={isLoading}
              />
              {!isEditing && !imageFile && (
                <p className="text-sm text-destructive">Image is required</p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || (!isEditing && !imageFile)}>
                {isLoading
                  ? isEditing
                    ? "Saving..."
                    : "Creating..."
                  : isEditing
                    ? "Save Changes"
                    : "Create Meal"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
