import { db } from "~/server/db";
import { orders } from "~/server/db/schema/orders";
import { orderMeals } from "~/server/db/schema/order-meals";
import { tables } from "~/server/db/schema/tables";
import { meals } from "~/server/db/schema/meals";
import { accounts } from "~/server/db/schema/accounts";
import { eq, and, desc, gte, lte, sum, count } from "drizzle-orm";
import type { NewOrder, NewOrderMeal, CreateOrderData } from "./types";

export async function getOrderById(id: string) {
  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function getOrderWithDetails(id: string) {
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
    .where(eq(orders.id, id))
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
    .where(eq(orderMeals.orderId, id));

  return { ...order[0], orderMeals: items };
}

export async function getOrdersByTenant(tenantId: string) {
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
    .where(eq(orders.idTenant, tenantId))
    .orderBy(desc(orders.date));

  return result;
}

export async function getUnpaidOrders(tenantId: string) {
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
    .where(and(eq(orders.idTenant, tenantId), eq(orders.paid, false)))
    .orderBy(desc(orders.date));

  return result;
}

export async function getPaidOrders(tenantId: string) {
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

export async function getDailyPaidOrders(tenantId: string) {
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

export async function createOrder(data: CreateOrderData, userId: string, tenantId: string) {
  const total = data.items.reduce(
    (sum, item) => sum + item.mealPrice * item.quantity,
    0
  );

  const [order] = await db
    .insert(orders)
    .values({
      idTable: data.idTable,
      idUser: userId,
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

  await db.update(tables).set({ status: true }).where(eq(tables.id, data.idTable));

  return order;
}

export async function addItemsToOrder(orderId: string, items: { mealId: string; quantity: number }[]) {
  if (items.length === 0) return;

  await db.insert(orderMeals).values(
    items.map((item) => ({
      orderId,
      mealId: item.mealId,
      quantity: item.quantity,
    }))
  );

  const order = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order[0]) return;

  let additionalTotal = 0;
  for (const item of items) {
    const meal = await db.select().from(meals).where(eq(meals.id, item.mealId)).limit(1);
    if (meal[0]) {
      additionalTotal += meal[0].price * item.quantity;
      await db
        .update(meals)
        .set({ quantity: meals.quantity - item.quantity })
        .where(eq(meals.id, item.mealId));
    }
  }

  await db
    .update(orders)
    .set({ total: order[0].total + additionalTotal })
    .where(eq(orders.id, orderId));
}

export async function updateOrderServed(id: string, served: boolean) {
  const result = await db
    .update(orders)
    .set({ served })
    .where(eq(orders.id, id))
    .returning();

  return result[0];
}

export async function updateOrderPaid(id: string, paid: boolean) {
  const order = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order[0]) throw new Error("Order not found");

  const result = await db
    .update(orders)
    .set({ paid })
    .where(eq(orders.id, id))
    .returning();

  if (paid) {
    await db.update(tables).set({ status: false }).where(eq(tables.id, order[0].idTable));
  }

  return result[0];
}

export async function deleteOrder(id: string) {
  const order = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order[0]) throw new Error("Order not found");

  const items = await db.select().from(orderMeals).where(eq(orderMeals.orderId, id));

  for (const item of items) {
    await db
      .update(meals)
      .set({ quantity: meals.quantity + item.quantity })
      .where(eq(meals.id, item.mealId));
  }

  await db.delete(orderMeals).where(eq(orderMeals.orderId, id));
  await db.delete(orders).where(eq(orders.id, id));

  await db.update(tables).set({ status: false }).where(eq(tables.id, order[0].idTable));

  return order[0];
}

export async function getOrdersCountByDay(tenantId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const result = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        eq(orders.idTenant, tenantId),
        gte(orders.date, today),
        lte(orders.date, tomorrow)
      )
    );

  return result[0]?.count ?? 0;
}

export async function getOrdersCountByMonth(tenantId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const result = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        eq(orders.idTenant, tenantId),
        gte(orders.date, startOfMonth),
        lte(orders.date, endOfMonth)
      )
    );

  return result[0]?.count ?? 0;
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
