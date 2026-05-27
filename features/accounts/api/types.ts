import type { Account, NewAccount } from "~/server/db/schema/accounts";

export type { Account, NewAccount };

export interface AccountWithTenant extends Account {
  tenants?: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
}

export interface AccountFormData {
  name: string;
  lastName: string;
  email?: string;
  role: "user" | "guest" | "admin";
}
