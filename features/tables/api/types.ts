import type { Table, NewTable } from "~/server/db/schema/tables";

export type { Table, NewTable };

export interface TableWithOrderInfo extends Table {
  currentOrder?: {
    id: string;
    total: number;
    served: boolean;
  } | null;
}
