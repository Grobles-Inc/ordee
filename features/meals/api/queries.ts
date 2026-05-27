import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMealById,
  getMealWithCategory,
  getMealsByTenant,
  getMealsByCategory,
  getAvailableMeals,
  createMeal,
  updateMeal,
  updateMealStock,
  updateMealQuantity,
  deleteMeal,
} from "./db";
import type { NewMeal } from "./types";

export const mealKeys = {
  all: ["meals"] as const,
  lists: () => [...mealKeys.all, "list"] as const,
  list: (tenantId: string) => [...mealKeys.lists(), tenantId] as const,
  listByCategory: (tenantId: string, categoryId: string) =>
    [...mealKeys.list(tenantId), "category", categoryId] as const,
  details: () => [...mealKeys.all, "detail"] as const,
  detail: (id: string) => [...mealKeys.details(), id] as const,
};

export function useMeal(id: string) {
  return useQuery({
    queryKey: mealKeys.detail(id),
    queryFn: () => getMealById(id),
    enabled: !!id,
  });
}

export function useMealWithCategory(id: string) {
  return useQuery({
    queryKey: [...mealKeys.detail(id), "with-category"],
    queryFn: () => getMealWithCategory(id),
    enabled: !!id,
  });
}

export function useMealsByTenant(tenantId: string) {
  return useQuery({
    queryKey: mealKeys.list(tenantId),
    queryFn: () => getMealsByTenant(tenantId),
    enabled: !!tenantId,
  });
}

export function useMealsByCategory(tenantId: string, categoryId: string) {
  return useQuery({
    queryKey: mealKeys.listByCategory(tenantId, categoryId),
    queryFn: () => getMealsByCategory(categoryId, tenantId),
    enabled: !!tenantId && !!categoryId,
  });
}

export function useAvailableMeals(tenantId: string) {
  return useQuery({
    queryKey: [...mealKeys.list(tenantId), "available"],
    queryFn: () => getAvailableMeals(tenantId),
    enabled: !!tenantId,
  });
}

export function useCreateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewMeal) => createMeal(data),
    onSuccess: (data) => {
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: mealKeys.list(data.idTenant),
        });
      }
      toast.success("Meal created successfully");
    },
    onError: (error) => {
      console.error("Failed to create meal:", error);
      toast.error("Failed to create meal");
    },
  });
}

export function useUpdateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewMeal> }) =>
      updateMeal(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: mealKeys.detail(data.id),
      });
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: mealKeys.list(data.idTenant),
        });
      }
      toast.success("Meal updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update meal:", error);
      toast.error("Failed to update meal");
    },
  });
}

export function useUpdateMealStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: boolean }) =>
      updateMealStock(id, stock),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: mealKeys.detail(data.id),
      });
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: mealKeys.list(data.idTenant),
        });
      }
      toast.success(
        data.stock ? "Meal marked as available" : "Meal marked as unavailable"
      );
    },
    onError: (error) => {
      console.error("Failed to update stock:", error);
      toast.error("Failed to update availability");
    },
  });
}

export function useUpdateMealQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      updateMealQuantity(id, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: mealKeys.detail(data.id),
      });
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: mealKeys.list(data.idTenant),
        });
      }
      toast.success("Quantity updated");
    },
    onError: (error) => {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity");
    },
  });
}

export function useDeleteMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMeal(id),
    onSuccess: (data) => {
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: mealKeys.list(data.idTenant),
        });
      }
      toast.success("Meal deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete meal:", error);
      toast.error("Failed to delete meal");
    },
  });
}
