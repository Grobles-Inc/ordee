import type { Category, CategoryWithMealCount } from "./types";

export function getCategoryDisplayName(category: Category): string {
  return category.name;
}

export function getCategoryDescription(category: Category): string {
  return category.description ?? "No description";
}

export function filterCategoriesByName(
  categories: Category[],
  search: string
): Category[] {
  const lowerSearch = search.toLowerCase();
  return categories.filter((c) =>
    c.name.toLowerCase().includes(lowerSearch)
  );
}

export function sortCategoriesByName(
  categories: Category[],
  direction: "asc" | "desc" = "asc"
): Category[] {
  return [...categories].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return direction === "asc" ? comparison : -comparison;
  });
}
