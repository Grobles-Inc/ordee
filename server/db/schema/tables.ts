import {
  boolean,
  integer,
  pgTable,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tenants } from "./tenants";
import { orders } from "./orders";

export const tables = pgTable("tables", {
  id: uuid("id").defaultRandom().primaryKey(),
  number: integer("number").notNull(),
  status: boolean("status").default(false), // false = available, true = occupied
  disabled: boolean("disabled").default(false),
  idTenant: uuid("id_tenant").references(() => tenants.id),
});

export const tablesRelations = relations(tables, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [tables.idTenant],
    references: [tenants.id],
  }),
  orders: many(orders),
}));

export type Table = typeof tables.$inferSelect;
export type NewTable = typeof tables.$inferInsert;
