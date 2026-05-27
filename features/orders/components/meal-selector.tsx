import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Search, Plus, Minus } from "lucide-react";
import { formatPrice, isMealAvailable } from "~/features/meals/api/services";
import type { MealWithCategory } from "~/features/meals/api/types";

interface MealSelectorProps {
  meals: MealWithCategory[];
  onSelect: (meal: MealWithCategory, quantity: number) => void;
  selectedMealIds?: string[];
}

export function MealSelector({
  meals,
  onSelect,
  selectedMealIds = [],
}: MealSelectorProps) {
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const filteredMeals = meals.filter(
    (meal) =>
      meal.name.toLowerCase().includes(search.toLowerCase()) &&
      isMealAvailable(meal)
  );

  function getQuantity(mealId: string) {
    return quantities[mealId] || 1;
  }

  function setQuantity(mealId: string, qty: number) {
    setQuantities((prev) => ({ ...prev, [mealId]: Math.max(1, qty) }));
  }

  function handleSelect(meal: MealWithCategory) {
    onSelect(meal, getQuantity(meal.id));
    setQuantity(meal.id, 1);
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search meals..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-h-[300px] overflow-y-auto space-y-2">
        {filteredMeals.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No meals available
          </p>
        ) : (
          filteredMeals.map((meal) => {
            const isSelected = selectedMealIds.includes(meal.id);
            return (
              <div
                key={meal.id}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{meal.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(meal.price)}
                    </span>
                    {meal.categories && (
                      <Badge variant="secondary" className="text-xs">
                        {meal.categories.name}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        setQuantity(meal.id, getQuantity(meal.id) - 1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">
                      {getQuantity(meal.id)}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        setQuantity(meal.id, getQuantity(meal.id) + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSelect(meal)}
                    disabled={isSelected}
                  >
                    {isSelected ? "Added" : "Add"}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
