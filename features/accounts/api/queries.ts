import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAccountById,
  getAccountWithTenant,
  getAccountsByTenant,
  getUsersByTenant,
  createAccount,
  updateAccount,
  disableAccount,
} from "./db";
import type { NewAccount } from "./types";

export const accountKeys = {
  all: ["accounts"] as const,
  lists: () => [...accountKeys.all, "list"] as const,
  list: (tenantId: string) => [...accountKeys.lists(), tenantId] as const,
  details: () => [...accountKeys.all, "detail"] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
};

export function useAccount(id: string) {
  return useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: () => getAccountById(id),
    enabled: !!id,
  });
}

export function useAccountWithTenant(id: string) {
  return useQuery({
    queryKey: [...accountKeys.detail(id), "with-tenant"],
    queryFn: () => getAccountWithTenant(id),
    enabled: !!id,
  });
}

export function useAccountsByTenant(tenantId: string) {
  return useQuery({
    queryKey: accountKeys.list(tenantId),
    queryFn: () => getAccountsByTenant(tenantId),
    enabled: !!tenantId,
  });
}

export function useUsersByTenant(tenantId: string, excludeUserId: string) {
  return useQuery({
    queryKey: [...accountKeys.list(tenantId), "users", excludeUserId],
    queryFn: () => getUsersByTenant(tenantId, excludeUserId),
    enabled: !!tenantId && !!excludeUserId,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewAccount) => createAccount(data),
    onSuccess: (data) => {
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: accountKeys.list(data.idTenant),
        });
      }
      toast.success("Account created successfully");
    },
    onError: (error) => {
      console.error("Failed to create account:", error);
      toast.error("Failed to create account");
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewAccount> }) =>
      updateAccount(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: accountKeys.detail(data.id),
      });
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: accountKeys.list(data.idTenant),
        });
      }
      toast.success("Account updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update account:", error);
      toast.error("Failed to update account");
    },
  });
}

export function useDisableAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => disableAccount(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: accountKeys.detail(data.id),
      });
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: accountKeys.list(data.idTenant),
        });
      }
      toast.success("Account disabled successfully");
    },
    onError: (error) => {
      console.error("Failed to disable account:", error);
      toast.error("Failed to disable account");
    },
  });
}
