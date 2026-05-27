import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Plus, Search } from "lucide-react";
import { MealList } from "./components/meal-list";
import { MealFormDialog } from "./components/meal-form-dialog";
import { DeleteMealDialog } from "./components/delete-meal-dialog";
import { QuantityDialog } from "./components/quantity-dialog";
import { useMealsStore } from "./stores/meals";
import {
  useMealsByTenant,
  useCreateMeal,
  useUpdateMeal,
  useUpdateMealStock,
  useUpdateMealQuantity,
  useDeleteMeal,
} from "./api/queries";
import { uploadMealImage, deleteMealImage } from "~/server/functions/upload";
import { useCategoriesByTenant } from "~/features/categories/api/queries";
import { useAuth } from "~/hooks/use-auth";
import { filterMealsByName, filterMealsByCategory } from "./api/services";
import type { MealFormValues } from "./api/schemas";
import type { MealWithCategory } from "./api/types";

export function MealsFeature() {
  const { profile } = useAuth();
  const tenantId = profile?.idTenant;

  const {
    selectedMealId,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isQuantityDialogOpen,
    mealToDelete,
    searchQuery,
    selectedCategoryId,
    openAddDialog,
    closeAddDialog,
    openEditDialog,
    closeEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
    openQuantityDialog,
    closeQuantityDialog,
    setSearchQuery,
    setSelectedCategoryId,
  } = useMealsStore();

  const [mealToEdit, setMealToEdit] = useState<MealWithCategory | null>(null);

  const { data: meals = [], isLoading } = useMealsByTenant(tenantId ?? "");
  const { data: categories = [] } = useCategoriesByTenant(tenantId ?? "");

  const createMeal = useCreateMeal();
  const updateMeal = useUpdateMeal();
  const updateStock = useUpdateMealStock();
  const updateQuantity = useUpdateMealQuantity();
  const deleteMeal = useDeleteMeal();

  const filteredMeals = filterMealsByCategory(
    filterMealsByName(meals, searchQuery),
    selectedCategoryId
  );

  async function handleAdd(data: MealFormValues, imageFile: File | null) {
    if (!tenantId || !imageFile) return;

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64Data = result.split(",")[1];
          resolve(base64Data);
        };
        reader.readAsDataURL(imageFile);
      });

      const { url } = await uploadMealImage({
        data: { file: base64, fileName: imageFile.name },
      });

      createMeal.mutate(
        {
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          idCategory: data.idCategory,
          imageUrl: url,
          stock: data.quantity > 0,
          idTenant: tenantId,
        },
        {
          onSuccess: () => closeAddDialog(),
        }
      );
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  }

  async function handleEdit(data: MealFormValues, imageFile: File | null) {
    if (!selectedMealId) return;

    let imageUrl = mealToEdit?.imageUrl;

    if (imageFile) {
      try {
        if (mealToEdit?.imageUrl) {
          await deleteMealImage({ data: { imageUrl: mealToEdit.imageUrl } });
        }

        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const result = reader.result as string;
            const base64Data = result.split(",")[1];
            resolve(base64Data);
          };
          reader.readAsDataURL(imageFile);
        });

        const { url } = await uploadMealImage({
          data: { file: base64, fileName: imageFile.name },
        });
        imageUrl = url;
      } catch (error) {
        console.error("Failed to upload image:", error);
        return;
      }
    }

    updateMeal.mutate(
      {
        id: selectedMealId,
        data: {
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          idCategory: data.idCategory,
          imageUrl,
          stock: data.quantity > 0,
        },
      },
      {
        onSuccess: () => {
          closeEditDialog();
          setMealToEdit(null);
        },
      }
    );
  }

  function handleToggleStock(meal: MealWithCategory) {
    updateStock.mutate({ id: meal.id, stock: !meal.stock });
  }

  function handleUpdateQuantity(quantity: number) {
    if (!selectedMealId) return;
    updateQuantity.mutate(
      { id: selectedMealId, quantity },
      { onSuccess: () => closeQuantityDialog() }
    );
  }

  async function handleDelete() {
    if (!mealToDelete) return;

    const meal = meals.find((m) => m.id === mealToDelete);
    if (meal?.imageUrl) {
      try {
        await deleteMealImage({ data: { imageUrl: meal.imageUrl } });
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }

    deleteMeal.mutate(mealToDelete, {
      onSuccess: () => closeDeleteDialog(),
    });
  }

  function handleOpenEdit(meal: MealWithCategory) {
    setMealToEdit(meal);
    openEditDialog(meal.id);
  }

  const mealForDelete = meals.find((m) => m.id === mealToDelete);
  const mealForQuantity = meals.find((m) => m.id === selectedMealId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu</h1>
          <p className="text-muted-foreground">
            Manage your restaurant menu items
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Meal
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search meals..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={selectedCategoryId ?? "all"}
          onValueChange={(value) =>
            setSelectedCategoryId(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <MealList
        meals={filteredMeals}
        onEdit={handleOpenEdit}
        onDelete={(meal) => openDeleteDialog(meal.id)}
        onToggleStock={handleToggleStock}
        onUpdateQuantity={(meal) => openQuantityDialog(meal.id)}
        isLoading={isLoading}
      />

      <MealFormDialog
        open={isAddDialogOpen}
        onOpenChange={closeAddDialog}
        onSubmit={handleAdd}
        categories={categories}
        isLoading={createMeal.isPending}
      />

      <MealFormDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeEditDialog();
            setMealToEdit(null);
          }
        }}
        onSubmit={handleEdit}
        meal={mealToEdit}
        categories={categories}
        isLoading={updateMeal.isPending}
      />

      <DeleteMealDialog
        open={isDeleteDialogOpen}
        onOpenChange={closeDeleteDialog}
        meal={mealForDelete ?? null}
        onConfirm={handleDelete}
        isLoading={deleteMeal.isPending}
      />

      <QuantityDialog
        open={isQuantityDialogOpen}
        onOpenChange={closeQuantityDialog}
        meal={mealForQuantity ?? null}
        onSubmit={handleUpdateQuantity}
        isLoading={updateQuantity.isPending}
      />
    </div>
  );
}

export { MealCard } from "./components/meal-card";
export { MealList } from "./components/meal-list";
export { MealFormDialog } from "./components/meal-form-dialog";
export { DeleteMealDialog } from "./components/delete-meal-dialog";
export { QuantityDialog } from "./components/quantity-dialog";
export { ImageUpload } from "./components/image-upload";
export { useMealsStore } from "./stores/meals";
export * from "./api/queries";
export * from "./api/types";
export * from "./api/schemas";
