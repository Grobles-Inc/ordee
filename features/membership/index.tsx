import { PlanList } from "./components/plan-list";
import { UsageCard } from "./components/usage-card";
import { usePlans, useTenantPlan, useUpdateTenantPlan } from "./api/queries";
import { useAuth } from "~/hooks/use-auth";
import type { Plan } from "./api/types";

export function MembershipFeature() {
  const { profile } = useAuth();
  const tenantId = profile?.idTenant;

  const { data: plans = [], isLoading: plansLoading } = usePlans();
  const { data: currentPlan, isLoading: currentPlanLoading } = useTenantPlan(
    tenantId ?? ""
  );
  const updatePlan = useUpdateTenantPlan();

  function handleSelectPlan(plan: Plan) {
    if (!tenantId) return;
    updatePlan.mutate({ tenantId, planId: plan.id });
  }

  if (plansLoading || currentPlanLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading plans...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Membership</h1>
        <p className="text-muted-foreground">
          Manage your subscription plan
        </p>
      </div>

      {currentPlan && <UsageCard plan={currentPlan} />}

      <div>
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        <PlanList
          plans={plans}
          currentPlanId={currentPlan?.id}
          onSelect={handleSelectPlan}
          isLoading={updatePlan.isPending}
        />
      </div>
    </div>
  );
}

export { PlanCard } from "./components/plan-card";
export { PlanList } from "./components/plan-list";
export { UsageCard } from "./components/usage-card";
export * from "./api/queries";
export * from "./api/types";
