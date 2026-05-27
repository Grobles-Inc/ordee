import type { Meal, MealWithCategory } from "./types";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function getMealDisplayName(meal: Meal): string {
  return meal.name;
}

export function isMealAvailable(meal: Meal): boolean {
  return meal.stock === true && meal.quantity > 0;
}

export function getStockStatus(meal: Meal): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  if (!meal.stock) {
    return { label: "Unavailable", variant: "destructive" };
  }
  if (meal.quantity <= 0) {
    return { label: "Out of stock", variant: "destructive" };
  }
  if (meal.quantity <= 5) {
    return { label: `Low stock (${meal.quantity})`, variant: "outline" };
  }
  return { label: `In stock (${meal.quantity})`, variant: "default" };
}

export function filterMealsByName(
  meals: MealWithCategory[],
  search: string
): MealWithCategory[] {
  const lowerSearch = search.toLowerCase();
  return meals.filter((m) =>
    m.name.toLowerCase().includes(lowerSearch)
  );
}

export function filterMealsByCategory(
  meals: MealWithCategory[],
  categoryId: string | null
): MealWithCategory[] {
  if (!categoryId) return meals;
  return meals.filter((m) => m.idCategory === categoryId);
}

export function filterAvailableMeals(
  meals: MealWithCategory[]
): MealWithCategory[] {
  return meals.filter(isMealAvailable);
}

export function sortMealsByPrice(
  meals: MealWithCategory[],
  direction: "asc" | "desc" = "asc"
): MealWithCategory[] {
  return [...meals].sort((a, b) => {
    return direction === "asc" ? a.price - b.price : b.price - a.price;
  });
}
