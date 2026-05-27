import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { formatPrice, getPlanUsagePercentage } from "../api/services";
import type { PlanWithUsage } from "../api/types";

interface UsageCardProps {
  plan: PlanWithUsage;
}

export function UsageCard({ plan }: UsageCardProps) {
  const percentage = getPlanUsagePercentage(plan);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Usage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Plan</span>
          <span className="font-medium">{plan.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Price</span>
          <span className="font-medium">
            {formatPrice(plan.price)}/{plan.billing}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Orders</span>
            <span className="font-medium">
              {plan.currentOrders} / {plan.ordersLimit ?? "∞"}
            </span>
          </div>
          {plan.ordersLimit && <Progress value={percentage} />}
        </div>
      </CardContent>
    </Card>
  );
}
