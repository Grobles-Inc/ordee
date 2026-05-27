import {
  Card,
  CardContent,
  CardDescription,
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
import { MoreHorizontal, Pencil, Trash2, Utensils } from "lucide-react";
import type { CategoryWithMealCount } from "../api/types";

interface CategoryListProps {
  categories: CategoryWithMealCount[];
  onEdit?: (category: CategoryWithMealCount) => void;
  onDelete?: (category: CategoryWithMealCount) => void;
  isLoading?: boolean;
}

export function CategoryList({
  categories,
  onEdit,
  onDelete,
  isLoading,
}: CategoryListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading categories...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No categories yet</p>
        <p className="text-sm text-muted-foreground">
          Create your first category to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">{category.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {category.description || "No description"}
              </CardDescription>
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
                  <DropdownMenuItem onClick={() => onEdit(category)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(category)}
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
            <Badge variant="secondary">
              {category.mealCount ?? 0} meal{(category.mealCount ?? 0) !== 1 ? "s" : ""}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
