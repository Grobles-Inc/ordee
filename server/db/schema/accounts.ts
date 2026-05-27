import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tenants } from "./tenants";
import { orders } from "./orders";

export const rolesEnum = pgEnum("roles", ["user", "guest", "admin"]);

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: text("email"),
  imageUrl: text("image_url"),
  role: rolesEnum("role").default("user"),
  idTenant: uuid("id_tenant").references(() => tenants.id),
  disabled: boolean("disabled").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [accounts.idTenant],
    references: [tenants.id],
  }),
  orders: many(orders),
}));

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
