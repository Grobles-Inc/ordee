import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Plus, Search } from "lucide-react";
import { CategoryList } from "./components/category-list";
import { CategoryFormDialog } from "./components/category-form-dialog";
import { DeleteCategoryDialog } from "./components/delete-category-dialog";
import { useCategoriesStore } from "./stores/categories";
import {
  useCategoriesWithMealCount,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "./api/queries";
import { useAuth } from "~/hooks/use-auth";
import { filterCategoriesByName } from "./api/services";
import type { CategoryFormValues } from "./api/schemas";
import type { Category, CategoryWithMealCount } from "./api/types";

export function CategoriesFeature() {
  const { profile } = useAuth();
  const tenantId = profile?.idTenant;

  const {
    selectedCategoryId,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    categoryToDelete,
    searchQuery,
    openAddDialog,
    closeAddDialog,
    openEditDialog,
    closeEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
    setSearchQuery,
  } = useCategoriesStore();

  const [categoryToEdit, setCategoryToEdit] =
    useState<CategoryWithMealCount | null>(null);

  const { data: categories = [], isLoading } = useCategoriesWithMealCount(
    tenantId ?? ""
  );

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const filteredCategories = filterCategoriesByName(categories, searchQuery);

  function handleAdd(data: CategoryFormValues) {
    if (!tenantId) return;

    createCategory.mutate(
      {
        name: data.name,
        description: data.description || null,
        idTenant: tenantId,
      },
      {
        onSuccess: () => closeAddDialog(),
      }
    );
  }

  function handleEdit(data: CategoryFormValues) {
    if (!selectedCategoryId) return;

    updateCategory.mutate(
      {
        id: selectedCategoryId,
        data: {
          name: data.name,
          description: data.description || null,
        },
      },
      {
        onSuccess: () => {
          closeEditDialog();
          setCategoryToEdit(null);
        },
      }
    );
  }

  function handleDelete() {
    if (!categoryToDelete) return;

    deleteCategory.mutate(categoryToDelete, {
      onSuccess: () => closeDeleteDialog(),
    });
  }

  function handleOpenEdit(category: CategoryWithMealCount) {
    setCategoryToEdit(category);
    openEditDialog(category.id);
  }

  const categoryForDelete = categories.find(
    (c) => c.id === categoryToDelete
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Organize your menu items into categories
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <CategoryList
        categories={filteredCategories}
        onEdit={handleOpenEdit}
        onDelete={(cat) => openDeleteDialog(cat.id)}
        isLoading={isLoading}
      />

      <CategoryFormDialog
        open={isAddDialogOpen}
        onOpenChange={closeAddDialog}
        onSubmit={handleAdd}
        isLoading={createCategory.isPending}
      />

      <CategoryFormDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeEditDialog();
            setCategoryToEdit(null);
          }
        }}
        onSubmit={handleEdit}
        category={categoryToEdit}
        isLoading={updateCategory.isPending}
      />

      <DeleteCategoryDialog
        open={isDeleteDialogOpen}
        onOpenChange={closeDeleteDialog}
        category={categoryForDelete ?? null}
        onConfirm={handleDelete}
        isLoading={deleteCategory.isPending}
        hasMeals={(categoryForDelete?.mealCount ?? 0) > 0}
      />
    </div>
  );
}

export { CategoryList } from "./components/category-list";
export { CategoryFormDialog } from "./components/category-form-dialog";
export { DeleteCategoryDialog } from "./components/delete-category-dialog";
export { useCategoriesStore } from "./stores/categories";
export * from "./api/queries";
export * from "./api/types";
export * from "./api/schemas";
