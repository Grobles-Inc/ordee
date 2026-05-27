import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCategoryById,
  getCategoriesByTenant,
  getCategoriesWithMealCount,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./db";
import type { NewCategory } from "./types";

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (tenantId: string) => [...categoryKeys.lists(), tenantId] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
}

export function useCategoriesByTenant(tenantId: string) {
  return useQuery({
    queryKey: categoryKeys.list(tenantId),
    queryFn: () => getCategoriesByTenant(tenantId),
    enabled: !!tenantId,
  });
}

export function useCategoriesWithMealCount(tenantId: string) {
  return useQuery({
    queryKey: [...categoryKeys.list(tenantId), "with-meal-count"],
    queryFn: () => getCategoriesWithMealCount(tenantId),
    enabled: !!tenantId,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewCategory) => createCategory(data),
    onSuccess: (data) => {
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: categoryKeys.list(data.idTenant),
        });
      }
      toast.success("Category created successfully");
    },
    onError: (error) => {
      console.error("Failed to create category:", error);
      toast.error("Failed to create category");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewCategory> }) =>
      updateCategory(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(data.id),
      });
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: categoryKeys.list(data.idTenant),
        });
      }
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update category:", error);
      toast.error("Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: (data) => {
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: categoryKeys.list(data.idTenant),
        });
      }
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category");
    },
  });
}
