import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Ban,
  CheckCircle2,
  Users,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { getTableDisplayName, getTableStatus, formatPrice } from "../api/services";
import type { TableWithOrderInfo } from "../api/types";

interface TableCardProps {
  table: TableWithOrderInfo;
  onEdit?: (table: TableWithOrderInfo) => void;
  onDelete?: (table: TableWithOrderInfo) => void;
  onToggleStatus?: (table: TableWithOrderInfo) => void;
  onDisable?: (table: TableWithOrderInfo) => void;
  onEnable?: (table: TableWithOrderInfo) => void;
}

export function TableCard({
  table,
  onEdit,
  onDelete,
  onToggleStatus,
  onDisable,
  onEnable,
}: TableCardProps) {
  const status = getTableStatus(table);

  return (
    <Card
      className={cn(
        "transition-colors",
        table.disabled && "opacity-50",
        table.status && !table.disabled && "border-destructive"
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">
            {getTableDisplayName(table)}
          </CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(table)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onToggleStatus && !table.disabled && (
              <DropdownMenuItem onClick={() => onToggleStatus(table)}>
                {table.status ? (
                  <>
                    <ToggleLeft className="mr-2 h-4 w-4" />
                    Mark Available
                  </>
                ) : (
                  <>
                    <ToggleRight className="mr-2 h-4 w-4" />
                    Mark Occupied
                  </>
                )}
              </DropdownMenuItem>
            )}
            {table.disabled ? (
              onEnable && (
                <DropdownMenuItem onClick={() => onEnable(table)}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Enable
                </DropdownMenuItem>
              )
            ) : (
              onDisable && (
                <DropdownMenuItem onClick={() => onDisable(table)}>
                  <Ban className="mr-2 h-4 w-4" />
                  Disable
                </DropdownMenuItem>
              )
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(table)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant={status.variant}>{status.label}</Badge>
          {table.currentOrder && (
            <span className="text-sm font-medium">
              ${table.currentOrder.total.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
