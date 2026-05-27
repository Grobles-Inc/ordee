import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getTableById,
  getTablesByTenant,
  getAvailableTables,
  getTablesWithCurrentOrder,
  createTable,
  updateTable,
  updateTableStatus,
  disableTable,
  enableTable,
  deleteTable,
} from "./db";
import type { NewTable } from "./types";

export const tableKeys = {
  all: ["tables"] as const,
  lists: () => [...tableKeys.all, "list"] as const,
  list: (tenantId: string) => [...tableKeys.lists(), tenantId] as const,
  details: () => [...tableKeys.all, "detail"] as const,
  detail: (id: string) => [...tableKeys.details(), id] as const,
};

export function useTable(id: string) {
  return useQuery({
    queryKey: tableKeys.detail(id),
    queryFn: () => getTableById(id),
    enabled: !!id,
  });
}

export function useTablesByTenant(tenantId: string) {
  return useQuery({
    queryKey: tableKeys.list(tenantId),
    queryFn: () => getTablesByTenant(tenantId),
    enabled: !!tenantId,
  });
}

export function useAvailableTables(tenantId: string) {
  return useQuery({
    queryKey: [...tableKeys.list(tenantId), "available"],
    queryFn: () => getAvailableTables(tenantId),
    enabled: !!tenantId,
  });
}

export function useTablesWithCurrentOrder(tenantId: string) {
  return useQuery({
    queryKey: [...tableKeys.list(tenantId), "with-orders"],
    queryFn: () => getTablesWithCurrentOrder(tenantId),
    enabled: !!tenantId,
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewTable) => createTable(data),
    onSuccess: (data) => {
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: tableKeys.list(data.idTenant),
        });
      }
      toast.success("Table created successfully");
    },
    onError: (error) => {
      console.error("Failed to create table:", error);
      toast.error("Failed to create table");
    },
  });
}

export function useUpdateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewTable> }) =>
      updateTable(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: tableKeys.detail(data.id),
      });
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: tableKeys.list(data.idTenant),
        });
      }
      toast.success("Table updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update table:", error);
      toast.error("Failed to update table");
    },
  });
}

export function useUpdateTableStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      updateTableStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: tableKeys.detail(data.id),
      });
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: tableKeys.list(data.idTenant),
        });
      }
      toast.success(
        data.status ? "Table marked as occupied" : "Table marked as available"
      );
    },
    onError: (error) => {
      console.error("Failed to update table status:", error);
      toast.error("Failed to update table status");
    },
  });
}

export function useDisableTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => disableTable(id),
    onSuccess: (data) => {
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: tableKeys.list(data.idTenant),
        });
      }
      toast.success("Table disabled");
    },
    onError: (error) => {
      console.error("Failed to disable table:", error);
      toast.error("Failed to disable table");
    },
  });
}

export function useEnableTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => enableTable(id),
    onSuccess: (data) => {
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: tableKeys.list(data.idTenant),
        });
      }
      toast.success("Table enabled");
    },
    onError: (error) => {
      console.error("Failed to enable table:", error);
      toast.error("Failed to enable table");
    },
  });
}

export function useDeleteTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTable(id),
    onSuccess: (data) => {
      if (data.idTenant) {
        queryClient.invalidateQueries({
          queryKey: tableKeys.list(data.idTenant),
        });
      }
      toast.success("Table deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete table:", error);
      toast.error("Failed to delete table");
    },
  });
}
