import type { Category, NewCategory } from "~/server/db/schema/categories";

export type { Category, NewCategory };

export interface CategoryWithMealCount extends Category {
  mealCount?: number;
}
