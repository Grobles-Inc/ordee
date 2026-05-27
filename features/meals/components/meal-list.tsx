import { UtensilsCrossed } from "lucide-react";
import { MealCard } from "./meal-card";
import type { MealWithCategory } from "../api/types";

interface MealListProps {
  meals: MealWithCategory[];
  onEdit?: (meal: MealWithCategory) => void;
  onDelete?: (meal: MealWithCategory) => void;
  onToggleStock?: (meal: MealWithCategory) => void;
  onUpdateQuantity?: (meal: MealWithCategory) => void;
  isLoading?: boolean;
}

export function MealList({
  meals,
  onEdit,
  onDelete,
  onToggleStock,
  onUpdateQuantity,
  isLoading,
}: MealListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading meals...</p>
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No meals found</p>
        <p className="text-sm text-muted-foreground">
          Add your first meal to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {meals.map((meal) => (
        <MealCard
          key={meal.id}
          meal={meal}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStock={onToggleStock}
          onUpdateQuantity={onUpdateQuantity}
        />
      ))}
    </div>
  );
}
