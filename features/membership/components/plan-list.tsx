import { PlanCard } from "./plan-card";
import type { Plan } from "../api/types";

interface PlanListProps {
  plans: Plan[];
  currentPlanId?: number;
  onSelect: (plan: Plan) => void;
  isLoading?: boolean;
}

export function PlanList({
  plans,
  currentPlanId,
  onSelect,
  isLoading,
}: PlanListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isCurrentPlan={plan.id === currentPlanId}
          onSelect={onSelect}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
