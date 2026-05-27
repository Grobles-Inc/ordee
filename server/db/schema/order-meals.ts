import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orders } from "./orders";
import { meals } from "./meals";

export const orderMeals = pgTable("order_meals", {
  id: uuid("id").defaultRandom().primaryKey(),
  mealId: uuid("meal_id")
    .notNull()
    .references(() => meals.id),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  quantity: integer("quantity").notNull(),
});

export const orderMealsRelations = relations(orderMeals, ({ one }) => ({
  meal: one(meals, {
    fields: [orderMeals.mealId],
    references: [meals.id],
  }),
  order: one(orders, {
    fields: [orderMeals.orderId],
    references: [orders.id],
  }),
}));

export type OrderMeal = typeof orderMeals.$inferSelect;
export type NewOrderMeal = typeof orderMeals.$inferInsert;
