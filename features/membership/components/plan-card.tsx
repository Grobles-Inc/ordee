import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Check } from "lucide-react";
import { formatPrice, getPlanLimits } from "../api/services";
import type { Plan } from "../api/types";

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan?: boolean;
  onSelect: (plan: Plan) => void;
  isLoading?: boolean;
}

export function PlanCard({
  plan,
  isCurrentPlan,
  onSelect,
  isLoading,
}: PlanCardProps) {
  return (
    <Card className={isCurrentPlan ? "border-primary" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{plan.name}</CardTitle>
          {isCurrentPlan && <Badge>Current Plan</Badge>}
        </div>
        <CardDescription>{getPlanLimits(plan)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {formatPrice(plan.price)}
          <span className="text-sm font-normal text-muted-foreground">
            /{plan.billing}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrentPlan ? "outline" : "default"}
          disabled={isCurrentPlan || isLoading}
          onClick={() => onSelect(plan)}
        >
          {isCurrentPlan ? "Current Plan" : "Select Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
