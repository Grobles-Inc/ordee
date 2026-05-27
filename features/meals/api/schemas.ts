import { z } from "zod";

export const mealFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name is too long"),
  price: z
    .number()
    .min(0, "Price must be positive")
    .max(99999, "Price is too high"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative"),
  idCategory: z
    .string()
    .min(1, "Category is required"),
});

export const mealImageSchema = z.object({
  image: z.instanceof(File, { message: "Image is required" }),
});

export type MealFormValues = z.infer<typeof mealFormSchema>;
export type MealImageValues = z.infer<typeof mealImageSchema>;
