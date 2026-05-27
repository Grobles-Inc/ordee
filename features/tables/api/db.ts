import { db } from "~/server/db";
import { tables } from "~/server/db/schema/tables";
import { orders } from "~/server/db/schema/orders";
import { eq, and, desc } from "drizzle-orm";
import type { NewTable } from "./types";

export async function getTableById(id: string) {
  const result = await db
    .select()
    .from(tables)
    .where(eq(tables.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function getTablesByTenant(tenantId: string) {
  return db
    .select()
    .from(tables)
    .where(eq(tables.idTenant, tenantId))
    .orderBy(tables.number);
}

export async function getAvailableTables(tenantId: string) {
  return db
    .select()
    .from(tables)
    .where(
      and(
        eq(tables.idTenant, tenantId),
        eq(tables.status, false),
        eq(tables.disabled, false)
      )
    )
    .orderBy(tables.number);
}

export async function getTablesWithCurrentOrder(tenantId: string) {
  const allTables = await db
    .select()
    .from(tables)
    .where(eq(tables.idTenant, tenantId))
    .orderBy(tables.number);

  const tablesWithOrders = await Promise.all(
    allTables.map(async (table) => {
      if (!table.status) {
        return { ...table, currentOrder: null };
      }

      const currentOrder = await db
        .select({
          id: orders.id,
          total: orders.total,
          served: orders.served,
        })
        .from(orders)
        .where(
          and(
            eq(orders.idTable, table.id),
            eq(orders.paid, false)
          )
        )
        .orderBy(desc(orders.date))
        .limit(1);

      return {
        ...table,
        currentOrder: currentOrder[0] ?? null,
      };
    })
  );

  return tablesWithOrders;
}

export async function createTable(data: NewTable) {
  const result = await db
    .insert(tables)
    .values(data)
    .returning();

  return result[0];
}

export async function updateTable(id: string, data: Partial<NewTable>) {
  const result = await db
    .update(tables)
    .set(data)
    .where(eq(tables.id, id))
    .returning();

  return result[0];
}

export async function updateTableStatus(id: string, status: boolean) {
  const result = await db
    .update(tables)
    .set({ status })
    .where(eq(tables.id, id))
    .returning();

  return result[0];
}

export async function disableTable(id: string) {
  const result = await db
    .update(tables)
    .set({ disabled: true, status: false })
    .where(eq(tables.id, id))
    .returning();

  return result[0];
}

export async function enableTable(id: string) {
  const result = await db
    .update(tables)
    .set({ disabled: false })
    .where(eq(tables.id, id))
    .returning();

  return result[0];
}

export async function deleteTable(id: string) {
  const result = await db
    .delete(tables)
    .where(eq(tables.id, id))
    .returning();

  return result[0];
}
