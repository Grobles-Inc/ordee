import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import { PaymentList } from "./components/payment-list";
import { PaymentStats } from "./components/payment-stats";
import { Receipt } from "./components/receipt";
import { usePaymentsStore } from "./stores/payments";
import {
  usePaidOrders,
  useDailyPaidOrders,
  useDailyRevenue,
  useDailyOrderCount,
} from "./api/queries";
import { useAuth } from "~/hooks/use-auth";
import { filterPaymentsBySearch } from "./api/services";
import type { OrderWithDetails } from "./api/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export function PaymentsFeature() {
  const { profile } = useAuth();
  const tenantId = profile?.idTenant;

  const { searchQuery, setSearchQuery } = usePaymentsStore();

  const [viewingOrder, setViewingOrder] = useState<OrderWithDetails | null>(
    null
  );

  const { data: paidOrders = [], isLoading } = usePaidOrders(
    tenantId ?? ""
  );
  const { data: dailyRevenue = 0 } = useDailyRevenue(tenantId ?? "");
  const { data: dailyOrderCount = 0 } = useDailyOrderCount(tenantId ?? "");

  const filteredOrders = filterPaymentsBySearch(paidOrders, searchQuery);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-muted-foreground">View paid orders and receipts</p>
      </div>

      <PaymentStats
        dailyRevenue={dailyRevenue}
        dailyOrderCount={dailyOrderCount}
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search payments..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <PaymentList
        orders={filteredOrders}
        onViewReceipt={setViewingOrder}
        isLoading={isLoading}
      />

      <Dialog
        open={!!viewingOrder}
        onOpenChange={(open) => {
          if (!open) setViewingOrder(null);
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Receipt</DialogTitle>
          </DialogHeader>
          {viewingOrder && <Receipt order={viewingOrder} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { PaymentCard } from "./components/payment-card";
export { PaymentList } from "./components/payment-list";
export { PaymentStats } from "./components/payment-stats";
export { Receipt } from "./components/receipt";
export { usePaymentsStore } from "./stores/payments";
export * from "./api/queries";
export * from "./api/types";
