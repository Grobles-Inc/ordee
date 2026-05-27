import type { Account, AccountWithTenant } from "./types";

export function getDisplayName(account: Account): string {
  return `${account.name} ${account.lastName}`.trim();
}

export function getInitials(account: Account): string {
  const first = account.name?.charAt(0) ?? "";
  const last = account.lastName?.charAt(0) ?? "";
  return `${first}${last}`.toUpperCase();
}

export function getRoleBadgeVariant(
  role: string | null
): "default" | "secondary" | "destructive" | "outline" {
  switch (role) {
    case "admin":
      return "destructive";
    case "user":
      return "default";
    case "guest":
      return "secondary";
    default:
      return "outline";
  }
}

export function filterActiveAccounts(accounts: Account[]): Account[] {
  return accounts.filter((a) => !a.disabled);
}

export function filterByRole(
  accounts: Account[],
  role: "user" | "guest" | "admin"
): Account[] {
  return accounts.filter((a) => a.role === role);
}
