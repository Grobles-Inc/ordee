import {
  boolean,
  pgTable,
  real,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tenants } from "./tenants";
import { tables } from "./tables";
import { accounts } from "./accounts";
import { orderMeals } from "./order-meals";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  idTable: uuid("id_table")
    .notNull()
    .references(() => tables.id),
  idUser: uuid("id_user")
    .notNull()
    .references(() => accounts.id),
  idTenant: uuid("id_tenant")
    .notNull()
    .references(() => tenants.id),
  date: timestamp("date").defaultNow(),
  served: boolean("served").default(false),
  paid: boolean("paid").default(false),
  toGo: boolean("to_go").default(false),
  total: real("total").notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  table: one(tables, {
    fields: [orders.idTable],
    references: [tables.id],
  }),
  user: one(accounts, {
    fields: [orders.idUser],
    references: [accounts.id],
  }),
  tenant: one(tenants, {
    fields: [orders.idTenant],
    references: [tenants.id],
  }),
  orderMeals: many(orderMeals),
}));

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
