import { db } from "~/server/db";
import { orders } from "~/server/db/schema/orders";
import { eq, and, gte, lte, count, sum } from "drizzle-orm";
import type { DailyStats, HourlyData } from "./types";

export async function getDailyStats(tenantId: string): Promise<DailyStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [totalResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        eq(orders.idTenant, tenantId),
        gte(orders.date, today),
        lte(orders.date, tomorrow)
      )
    );

  const [paidResult] = await db
    .select({ count: count(), total: sum(orders.total) })
    .from(orders)
    .where(
      and(
        eq(orders.idTenant, tenantId),
        eq(orders.paid, true),
        gte(orders.date, today),
        lte(orders.date, tomorrow)
      )
    );

  const [servedResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        eq(orders.idTenant, tenantId),
        eq(orders.served, true),
        eq(orders.paid, false),
        gte(orders.date, today),
        lte(orders.date, tomorrow)
      )
    );

  const totalOrders = totalResult?.count ?? 0;
  const paidOrders = paidResult?.count ?? 0;
  const totalRevenue = Number(paidResult?.total ?? 0);
  const servedOrders = servedResult?.count ?? 0;
  const pendingOrders = totalOrders - paidOrders - servedOrders;

  return {
    totalOrders,
    paidOrders,
    totalRevenue,
    servedOrders,
    pendingOrders,
  };
}

export async function getHourlyData(tenantId: string): Promise<HourlyData[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const result = await db
    .select({
      id: orders.id,
      date: orders.date,
      total: orders.total,
      paid: orders.paid,
    })
    .from(orders)
    .where(
      and(
        eq(orders.idTenant, tenantId),
        gte(orders.date, today),
        lte(orders.date, tomorrow)
      )
    );

  const hourlyMap = new Map<string, { orders: number; revenue: number }>();

  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0") + ":00";
    hourlyMap.set(hour, { orders: 0, revenue: 0 });
  }

  for (const order of result) {
    const date = new Date(order.date);
    const hour = date.getHours().toString().padStart(2, "0") + ":00";
    const data = hourlyMap.get(hour)!;
    data.orders += 1;
    if (order.paid) {
      data.revenue += order.total;
    }
  }

  return Array.from(hourlyMap.entries()).map(([hour, data]) => ({
    hour,
    ...data,
  }));
}
