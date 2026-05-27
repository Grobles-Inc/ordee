import type { Plan, PlanWithUsage } from "./types";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function getPlanLimits(plan: Plan): string {
  if (!plan.ordersLimit) return "Unlimited orders";
  return `${plan.ordersLimit} orders/month`;
}

export function isPlanLimitReached(plan: PlanWithUsage): boolean {
  if (!plan.ordersLimit) return false;
  return plan.currentOrders >= plan.ordersLimit;
}

export function getPlanUsagePercentage(plan: PlanWithUsage): number {
  if (!plan.ordersLimit) return 0;
  return Math.min(100, (plan.currentOrders / plan.ordersLimit) * 100);
}
