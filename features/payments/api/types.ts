import type { OrderWithDetails } from "~/features/orders/api/types";

export type { OrderWithDetails };

export interface PaymentReceipt {
  order: OrderWithDetails;
  tenantName: string;
  tenantLogo: string;
}
