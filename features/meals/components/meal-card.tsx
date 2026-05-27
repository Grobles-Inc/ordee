import {
  Card,
  CardContent,
  CardFooter,
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
  Package,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { formatPrice, getStockStatus } from "../api/services";
import type { MealWithCategory } from "../api/types";

interface MealCardProps {
  meal: MealWithCategory;
  onEdit?: (meal: MealWithCategory) => void;
  onDelete?: (meal: MealWithCategory) => void;
  onToggleStock?: (meal: MealWithCategory) => void;
  onUpdateQuantity?: (meal: MealWithCategory) => void;
}

export function MealCard({
  meal,
  onEdit,
  onDelete,
  onToggleStock,
  onUpdateQuantity,
}: MealCardProps) {
  const stockStatus = getStockStatus(meal);

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        {meal.imageUrl ? (
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">{meal.name}</CardTitle>
          {meal.categories && (
            <Badge variant="secondary" className="text-xs">
              {meal.categories.name}
            </Badge>
          )}
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
              <DropdownMenuItem onClick={() => onEdit(meal)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onToggleStock && (
              <DropdownMenuItem onClick={() => onToggleStock(meal)}>
                {meal.stock ? (
                  <>
                    <ToggleLeft className="mr-2 h-4 w-4" />
                    Mark Unavailable
                  </>
                ) : (
                  <>
                    <ToggleRight className="mr-2 h-4 w-4" />
                    Mark Available
                  </>
                )}
              </DropdownMenuItem>
            )}
            {onUpdateQuantity && (
              <DropdownMenuItem onClick={() => onUpdateQuantity(meal)}>
                <Package className="mr-2 h-4 w-4" />
                Update Quantity
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(meal)}
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
          <span className="text-lg font-semibold">
            {formatPrice(meal.price)}
          </span>
          <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
