import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DollarSign, ShoppingBag } from "lucide-react";
import { formatPrice } from "../api/services";

interface PaymentStatsProps {
  dailyRevenue: number;
  dailyOrderCount: number;
}

export function PaymentStats({
  dailyRevenue,
  dailyOrderCount,
}: PaymentStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPrice(dailyRevenue)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Today's Paid Orders
          </CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dailyOrderCount}</div>
        </CardContent>
      </Card>
    </div>
  );
}
