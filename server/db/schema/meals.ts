import {
  boolean,
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tenants } from "./tenants";
import { categories } from "./categories";
import { orderMeals } from "./order-meals";

export const meals = pgTable("meals", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: real("price").notNull(),
  imageUrl: text("image_url").notNull(),
  quantity: integer("quantity").notNull(),
  stock: boolean("stock").default(true),
  idCategory: uuid("id_category")
    .notNull()
    .references(() => categories.id),
  idTenant: uuid("id_tenant").references(() => tenants.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mealsRelations = relations(meals, ({ one, many }) => ({
  category: one(categories, {
    fields: [meals.idCategory],
    references: [categories.id],
  }),
  tenant: one(tenants, {
    fields: [meals.idTenant],
    references: [tenants.id],
  }),
  orderMeals: many(orderMeals),
}));

export type Meal = typeof meals.$inferSelect;
export type NewMeal = typeof meals.$inferInsert;
