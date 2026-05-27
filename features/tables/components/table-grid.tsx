import { LayoutGrid } from "lucide-react";
import { TableCard } from "./table-card";
import type { TableWithOrderInfo } from "../api/types";

interface TableGridProps {
  tables: TableWithOrderInfo[];
  onEdit?: (table: TableWithOrderInfo) => void;
  onDelete?: (table: TableWithOrderInfo) => void;
  onToggleStatus?: (table: TableWithOrderInfo) => void;
  onDisable?: (table: TableWithOrderInfo) => void;
  onEnable?: (table: TableWithOrderInfo) => void;
  isLoading?: boolean;
}

export function TableGrid({
  tables,
  onEdit,
  onDelete,
  onToggleStatus,
  onDisable,
  onEnable,
  isLoading,
}: TableGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading tables...</p>
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <LayoutGrid className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No tables found</p>
        <p className="text-sm text-muted-foreground">
          Add your first table to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {tables.map((table) => (
        <TableCard
          key={table.id}
          table={table}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onDisable={onDisable}
          onEnable={onEnable}
        />
      ))}
    </div>
  );
}
