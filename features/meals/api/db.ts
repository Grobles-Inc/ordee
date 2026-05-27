import { db } from "~/server/db";
import { meals } from "~/server/db/schema/meals";
import { categories } from "~/server/db/schema/categories";
import { eq, and } from "drizzle-orm";
import type { NewMeal } from "./types";

export async function getMealById(id: string) {
  const result = await db
    .select()
    .from(meals)
    .where(eq(meals.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function getMealWithCategory(id: string) {
  const result = await db
    .select({
      id: meals.id,
      name: meals.name,
      price: meals.price,
      imageUrl: meals.imageUrl,
      quantity: meals.quantity,
      stock: meals.stock,
      idCategory: meals.idCategory,
      idTenant: meals.idTenant,
      createdAt: meals.createdAt,
      categories: {
        id: categories.id,
        name: categories.name,
      },
    })
    .from(meals)
    .leftJoin(categories, eq(meals.idCategory, categories.id))
    .where(eq(meals.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function getMealsByTenant(tenantId: string) {
  return db
    .select({
      id: meals.id,
      name: meals.name,
      price: meals.price,
      imageUrl: meals.imageUrl,
      quantity: meals.quantity,
      stock: meals.stock,
      idCategory: meals.idCategory,
      idTenant: meals.idTenant,
      createdAt: meals.createdAt,
      categories: {
        id: categories.id,
        name: categories.name,
      },
    })
    .from(meals)
    .leftJoin(categories, eq(meals.idCategory, categories.id))
    .where(eq(meals.idTenant, tenantId))
    .orderBy(meals.name);
}

export async function getMealsByCategory(
  categoryId: string,
  tenantId: string
) {
  return db
    .select({
      id: meals.id,
      name: meals.name,
      price: meals.price,
      imageUrl: meals.imageUrl,
      quantity: meals.quantity,
      stock: meals.stock,
      idCategory: meals.idCategory,
      idTenant: meals.idTenant,
      createdAt: meals.createdAt,
      categories: {
        id: categories.id,
        name: categories.name,
      },
    })
    .from(meals)
    .leftJoin(categories, eq(meals.idCategory, categories.id))
    .where(
      and(eq(meals.idCategory, categoryId), eq(meals.idTenant, tenantId))
    )
    .orderBy(meals.name);
}

export async function getAvailableMeals(tenantId: string) {
  return db
    .select({
      id: meals.id,
      name: meals.name,
      price: meals.price,
      imageUrl: meals.imageUrl,
      quantity: meals.quantity,
      stock: meals.stock,
      idCategory: meals.idCategory,
      idTenant: meals.idTenant,
      createdAt: meals.createdAt,
      categories: {
        id: categories.id,
        name: categories.name,
      },
    })
    .from(meals)
    .leftJoin(categories, eq(meals.idCategory, categories.id))
    .where(and(eq(meals.idTenant, tenantId), eq(meals.stock, true)))
    .orderBy(meals.name);
}

export async function createMeal(data: NewMeal) {
  const result = await db
    .insert(meals)
    .values(data)
    .returning();

  return result[0];
}

export async function updateMeal(id: string, data: Partial<NewMeal>) {
  const result = await db
    .update(meals)
    .set(data)
    .where(eq(meals.id, id))
    .returning();

  return result[0];
}

export async function updateMealStock(id: string, stock: boolean) {
  const result = await db
    .update(meals)
    .set({ stock })
    .where(eq(meals.id, id))
    .returning();

  return result[0];
}

export async function updateMealQuantity(id: string, quantity: number) {
  const result = await db
    .update(meals)
    .set({ quantity, stock: quantity > 0 })
    .where(eq(meals.id, id))
    .returning();

  return result[0];
}

export async function deleteMeal(id: string) {
  const result = await db
    .delete(meals)
    .where(eq(meals.id, id))
    .returning();

  return result[0];
}
