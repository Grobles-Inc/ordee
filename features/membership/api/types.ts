import type { Plan } from "~/server/db/schema/plans";

export type { Plan };

export interface PlanWithUsage extends Plan {
  currentOrders: number;
}
