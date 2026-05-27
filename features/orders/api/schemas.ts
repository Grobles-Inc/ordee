import { z } from "zod";

export const orderItemSchema = z.object({
  mealId: z.string().min(1, "Meal is required"),
  mealName: z.string(),
  mealPrice: z.number(),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

export const createOrderSchema = z.object({
  idTable: z.string().min(1, "Table is required"),
  items: z
    .array(orderItemSchema)
    .min(1, "At least one item is required"),
  toGo: z.boolean().default(false),
});

export const addItemsSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, "At least one item is required"),
});

export type OrderItemValues = z.infer<typeof orderItemSchema>;
export type CreateOrderValues = z.infer<typeof createOrderSchema>;
export type AddItemsValues = z.infer<typeof addItemsSchema>;
