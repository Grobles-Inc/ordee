import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { plans } from "./plans";
import { accounts } from "./accounts";
import { categories } from "./categories";
import { meals } from "./meals";
import { tables } from "./tables";
import { orders } from "./orders";

export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  idAdmin: uuid("id_admin").notNull(),
  idPlan: integer("id_plan")
    .notNull()
    .references(() => plans.id),
  logo: text("logo"),
  queries: integer("queries").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  plan: one(plans, {
    fields: [tenants.idPlan],
    references: [plans.id],
  }),
  accounts: many(accounts),
  categories: many(categories),
  meals: many(meals),
  tables: many(tables),
  orders: many(orders),
}));

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
