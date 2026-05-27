import type { Meal, NewMeal } from "~/server/db/schema/meals";

export type { Meal, NewMeal };

export interface MealWithCategory extends Meal {
  categories?: {
    id: string;
    name: string;
  } | null;
}

export interface MealFormData {
  name: string;
  price: number;
  quantity: number;
  idCategory: string;
  imageFile?: File;
}
