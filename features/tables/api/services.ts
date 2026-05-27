import type { Table, TableWithOrderInfo } from "./types";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function getTableDisplayName(table: Table): string {
  return `Table ${table.number}`;
}

export function getTableStatus(table: Table): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  color: string;
} {
  if (table.disabled) {
    return { label: "Disabled", variant: "destructive", color: "text-destructive" };
  }
  if (table.status) {
    return { label: "Occupied", variant: "destructive", color: "text-destructive" };
  }
  return { label: "Available", variant: "default", color: "text-primary" };
}

export function filterAvailableTables(tables: Table[]): Table[] {
  return tables.filter((t) => !t.status && !t.disabled);
}

export function filterOccupiedTables(tables: Table[]): Table[] {
  return tables.filter((t) => t.status && !t.disabled);
}

export function filterDisabledTables(tables: Table[]): Table[] {
  return tables.filter((t) => t.disabled);
}

export function sortTablesByNumber(
  tables: Table[],
  direction: "asc" | "desc" = "asc"
): Table[] {
  return [...tables].sort((a, b) => {
    return direction === "asc" ? a.number - b.number : b.number - a.number;
  });
}

export function getTableStats(tables: Table[]) {
  const total = tables.filter((t) => !t.disabled).length;
  const available = tables.filter((t) => !t.status && !t.disabled).length;
  const occupied = tables.filter((t) => t.status && !t.disabled).length;
  const disabled = tables.filter((t) => t.disabled).length;

  return { total, available, occupied, disabled };
}
