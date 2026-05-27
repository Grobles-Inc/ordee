import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAllPlans, getTenantPlan, updateTenantPlan } from "./db";

export const membershipKeys = {
  all: ["membership"] as const,
  plans: () => [...membershipKeys.all, "plans"] as const,
  tenantPlan: (tenantId: string) =>
    [...membershipKeys.all, "tenant", tenantId] as const,
};

export function usePlans() {
  return useQuery({
    queryKey: membershipKeys.plans(),
    queryFn: getAllPlans,
  });
}

export function useTenantPlan(tenantId: string) {
  return useQuery({
    queryKey: membershipKeys.tenantPlan(tenantId),
    queryFn: () => getTenantPlan(tenantId),
    enabled: !!tenantId,
  });
}

export function useUpdateTenantPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, planId }: { tenantId: string; planId: number }) =>
      updateTenantPlan(tenantId, planId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: membershipKeys.tenantPlan(data.id),
      });
      toast.success("Plan updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update plan:", error);
      toast.error("Failed to update plan");
    },
  });
}
