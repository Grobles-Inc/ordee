import { useQuery } from "@tanstack/react-query";
import {
  getPaidOrdersWithDetails,
  getDailyPaidOrdersWithDetails,
  getOrderWithMeals,
  getDailyRevenue,
  getDailyOrderCount,
} from "./db";

export const paymentKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list: (tenantId: string) => [...paymentKeys.lists(), tenantId] as const,
  details: () => [...paymentKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
};

export function usePaidOrders(tenantId: string) {
  return useQuery({
    queryKey: paymentKeys.list(tenantId),
    queryFn: () => getPaidOrdersWithDetails(tenantId),
    enabled: !!tenantId,
  });
}

export function useDailyPaidOrders(tenantId: string) {
  return useQuery({
    queryKey: [...paymentKeys.list(tenantId), "daily"],
    queryFn: () => getDailyPaidOrdersWithDetails(tenantId),
    enabled: !!tenantId,
  });
}

export function useOrderWithMeals(orderId: string) {
  return useQuery({
    queryKey: paymentKeys.detail(orderId),
    queryFn: () => getOrderWithMeals(orderId),
    enabled: !!orderId,
  });
}

export function useDailyRevenue(tenantId: string) {
  return useQuery({
    queryKey: [...paymentKeys.list(tenantId), "revenue"],
    queryFn: () => getDailyRevenue(tenantId),
    enabled: !!tenantId,
  });
}

export function useDailyOrderCount(tenantId: string) {
  return useQuery({
    queryKey: [...paymentKeys.list(tenantId), "count"],
    queryFn: () => getDailyOrderCount(tenantId),
    enabled: !!tenantId,
  });
}
