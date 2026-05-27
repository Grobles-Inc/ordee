import { db } from "~/server/db";
import { orders } from "~/server/db/schema/orders";
import { orderMeals } from "~/server/db/schema/order-meals";
import { tables } from "~/server/db/schema/tables";
import { meals } from "~/server/db/schema/meals";
import { eq, and } from "drizzle-orm";
import type { GuestOrderData } from "./types";

export async function createGuestOrder(
  data: GuestOrderData,
  guestId: string,
  tenantId: string
) {
  const total = data.items.reduce(
    (sum, item) => sum + item.mealPrice * item.quantity,
    0
  );

  const [order] = await db
    .insert(orders)
    .values({
      idTable: data.tableId,
      idUser: guestId,
      idTenant: tenantId,
      total,
      toGo: data.toGo,
    })
    .returning();

  if (data.items.length > 0) {
    await db.insert(orderMeals).values(
      data.items.map((item) => ({
        orderId: order.id,
        mealId: item.mealId,
        quantity: item.quantity,
      }))
    );

    for (const item of data.items) {
      await db
        .update(meals)
        .set({
          quantity: meals.quantity - item.quantity,
        })
        .where(eq(meals.id, item.mealId));
    }
  }

  await db.update(tables).set({ status: true }).where(eq(tables.id, data.tableId));

  return order;
}

export async function getGuestOrders(guestId: string, tenantId: string) {
  const result = await db
    .select({
      id: orders.id,
      idTable: orders.idTable,
      idUser: orders.idUser,
      idTenant: orders.idTenant,
      date: orders.date,
      served: orders.served,
      paid: orders.paid,
      toGo: orders.toGo,
      total: orders.total,
      tables: {
        id: tables.id,
        number: tables.number,
      },
    })
    .from(orders)
    .leftJoin(tables, eq(orders.idTable, tables.id))
    .where(and(eq(orders.idUser, guestId), eq(orders.idTenant, tenantId)))
    .orderBy(orders.date);

  return result;
}
