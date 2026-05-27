import { db } from "~/server/db";
import { plans } from "~/server/db/schema/plans";
import { tenants } from "~/server/db/schema/tenants";
import { orders } from "~/server/db/schema/orders";
import { eq, and, gte, lte, count } from "drizzle-orm";
import type { Plan, PlanWithUsage } from "./types";

export async function getAllPlans(): Promise<Plan[]> {
  return db.select().from(plans);
}

export async function getPlanById(id: number): Promise<Plan | null> {
  const result = await db.select().from(plans).where(eq(plans.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getTenantPlan(tenantId: string): Promise<PlanWithUsage | null> {
  const tenant = await db
    .select()
    .from(tenants)
    .where(eq(tenants.id, tenantId))
    .limit(1);

  if (!tenant[0]?.idPlan) return null;

  const plan = await getPlanById(tenant[0].idPlan);
  if (!plan) return null;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [orderCount] = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        eq(orders.idTenant, tenantId),
        gte(orders.date, startOfMonth),
        lte(orders.date, endOfMonth)
      )
    );

  return {
    ...plan,
    currentOrders: orderCount?.count ?? 0,
  };
}

export async function updateTenantPlan(tenantId: string, planId: number) {
  const result = await db
    .update(tenants)
    .set({ idPlan: planId })
    .where(eq(tenants.id, tenantId))
    .returning();

  return result[0];
}
