import { db } from "~/server/db";
import { categories } from "~/server/db/schema/categories";
import { meals } from "~/server/db/schema/meals";
import { eq, and, count } from "drizzle-orm";
import type { NewCategory } from "./types";

export async function getCategoryById(id: string) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function getCategoriesByTenant(tenantId: string) {
  return db
    .select()
    .from(categories)
    .where(eq(categories.idTenant, tenantId))
    .orderBy(categories.name);
}

export async function getCategoriesWithMealCount(tenantId: string) {
  const result = await db
    .select({
      id: categories.id,
      name: categories.name,
      description: categories.description,
      idTenant: categories.idTenant,
      createdAt: categories.createdAt,
      mealCount: count(meals.id),
    })
    .from(categories)
    .leftJoin(meals, eq(categories.id, meals.idCategory))
    .where(eq(categories.idTenant, tenantId))
    .groupBy(categories.id)
    .orderBy(categories.name);

  return result;
}

export async function createCategory(data: NewCategory) {
  const result = await db
    .insert(categories)
    .values(data)
    .returning();

  return result[0];
}

export async function updateCategory(id: string, data: Partial<NewCategory>) {
  const result = await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, id))
    .returning();

  return result[0];
}

export async function deleteCategory(id: string) {
  const result = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning();

  return result[0];
}

export async function checkCategoryHasMeals(categoryId: string) {
  const result = await db
    .select({ count: count(meals.id) })
    .from(meals)
    .where(eq(meals.idCategory, categoryId));

  return (result[0]?.count ?? 0) > 0;
}
