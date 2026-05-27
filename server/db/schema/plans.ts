import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tenants } from "./tenants";

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: integer("price").notNull(),
  billing: varchar("billing", { length: 50 }).notNull(), // "monthly" | "annual"
  ordersLimit: integer("orders_limit").notNull(),
});

export const plansRelations = relations(plans, ({ many }) => ({
  tenants: many(tenants),
}));

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;
