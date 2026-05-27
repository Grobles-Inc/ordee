import { db } from "~/server/db";
import { orders } from "~/server/db/schema/orders";
import { orderMeals } from "~/server/db/schema/order-meals";
import { tables } from "~/server/db/schema/tables";
import { meals } from "~/server/db/schema/meals";
import { accounts } from "~/server/db/schema/accounts";
import { eq, and, desc, gte, lte, sum } from "drizzle-orm";

export async function getPaidOrdersWithDetails(tenantId: string) {
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
      users: {
        id: accounts.id,
        name: accounts.name,
        lastName: accounts.lastName,
      },
    })
    .from(orders)
    .leftJoin(tables, eq(orders.idTable, tables.id))
    .leftJoin(accounts, eq(orders.idUser, accounts.id))
    .where(and(eq(orders.idTenant, tenantId), eq(orders.paid, true)))
    .orderBy(desc(orders.date));

  return result;
}

export async function getDailyPaidOrdersWithDetails(tenantId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

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
      users: {
        id: accounts.id,
        name: accounts.name,
        lastName: accounts.lastName,
      },
    })
    .from(orders)
    .leftJoin(tables, eq(orders.idTable, tables.id))
    .leftJoin(accounts, eq(orders.idUser, accounts.id))
    .where(
      and(
        eq(orders.idTenant, tenantId),
        eq(orders.paid, true),
        gte(orders.date, today),
        lte(orders.date, tomorrow)
      )
    )
    .orderBy(desc(orders.date));

  return result;
}

export async function getOrderWithMeals(orderId: string) {
  const order = await db
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
      users: {
        id: accounts.id,
        name: accounts.name,
        lastName: accounts.lastName,
      },
    })
    .from(orders)
    .leftJoin(tables, eq(orders.idTable, tables.id))
    .leftJoin(accounts, eq(orders.idUser, accounts.id))
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order[0]) return null;

  const items = await db
    .select({
      id: orderMeals.id,
      mealId: orderMeals.mealId,
      orderId: orderMeals.orderId,
      quantity: orderMeals.quantity,
      meals: {
        id: meals.id,
        name: meals.name,
        price: meals.price,
        imageUrl: meals.imageUrl,
      },
    })
    .from(orderMeals)
    .leftJoin(meals, eq(orderMeals.mealId, meals.id))
    .where(eq(orderMeals.orderId, orderId));

  return { ...order[0], orderMeals: items };
}

export async function getDailyRevenue(tenantId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const result = await db
    .select({ total: sum(orders.total) })
    .from(orders)
    .where(
      and(
        eq(orders.idTenant, tenantId),
        eq(orders.paid, true),
        gte(orders.date, today),
        lte(orders.date, tomorrow)
      )
    );

  return Number(result[0]?.total ?? 0);
}

export async function getDailyOrderCount(tenantId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const result = await db
    .select({ count: orders.id })
    .from(orders)
    .where(
      and(
        eq(orders.idTenant, tenantId),
        eq(orders.paid, true),
        gte(orders.date, today),
        lte(orders.date, tomorrow)
      )
    );

  return result.length;
}
