import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getOrderById,
  getOrderWithDetails,
  getOrdersByTenant,
  getUnpaidOrders,
  getPaidOrders,
  getDailyPaidOrders,
  createOrder,
  addItemsToOrder,
  updateOrderServed,
  updateOrderPaid,
  deleteOrder,
  getOrdersCountByDay,
  getOrdersCountByMonth,
  getDailyRevenue,
} from "./db";
import type { CreateOrderData } from "./types";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (tenantId: string) => [...orderKeys.lists(), tenantId] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
}

export function useOrderWithDetails(id: string) {
  return useQuery({
    queryKey: [...orderKeys.detail(id), "details"],
    queryFn: () => getOrderWithDetails(id),
    enabled: !!id,
  });
}

export function useOrdersByTenant(tenantId: string) {
  return useQuery({
    queryKey: orderKeys.list(tenantId),
    queryFn: () => getOrdersByTenant(tenantId),
    enabled: !!tenantId,
  });
}

export function useUnpaidOrders(tenantId: string) {
  return useQuery({
    queryKey: [...orderKeys.list(tenantId), "unpaid"],
    queryFn: () => getUnpaidOrders(tenantId),
    enabled: !!tenantId,
  });
}

export function usePaidOrders(tenantId: string) {
  return useQuery({
    queryKey: [...orderKeys.list(tenantId), "paid"],
    queryFn: () => getPaidOrders(tenantId),
    enabled: !!tenantId,
  });
}

export function useDailyPaidOrders(tenantId: string) {
  return useQuery({
    queryKey: [...orderKeys.list(tenantId), "daily-paid"],
    queryFn: () => getDailyPaidOrders(tenantId),
    enabled: !!tenantId,
  });
}

export function useOrdersCountByDay(tenantId: string) {
  return useQuery({
    queryKey: [...orderKeys.list(tenantId), "count-day"],
    queryFn: () => getOrdersCountByDay(tenantId),
    enabled: !!tenantId,
  });
}

export function useOrdersCountByMonth(tenantId: string) {
  return useQuery({
    queryKey: [...orderKeys.list(tenantId), "count-month"],
    queryFn: () => getOrdersCountByMonth(tenantId),
    enabled: !!tenantId,
  });
}

export function useDailyRevenue(tenantId: string) {
  return useQuery({
    queryKey: [...orderKeys.list(tenantId), "daily-revenue"],
    queryFn: () => getDailyRevenue(tenantId),
    enabled: !!tenantId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      userId,
      tenantId,
    }: {
      data: CreateOrderData;
      userId: string;
      tenantId: string;
    }) => createOrder(data, userId, tenantId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.list(data.idTenant),
      });
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
      queryClient.invalidateQueries({
        queryKey: ["meals"],
      });
      toast.success("Order created successfully");
    },
    onError: (error) => {
      console.error("Failed to create order:", error);
      toast.error("Failed to create order");
    },
  });
}

export function useAddItemsToOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      items,
    }: {
      orderId: string;
      items: { mealId: string; quantity: number }[];
    }) => addItemsToOrder(orderId, items),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: ["meals"],
      });
      toast.success("Items added to order");
    },
    onError: (error) => {
      console.error("Failed to add items:", error);
      toast.error("Failed to add items");
    },
  });
}

export function useUpdateOrderServed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, served }: { id: string; served: boolean }) =>
      updateOrderServed(id, served),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.list(data.idTenant),
      });
      toast.success(
        data.served ? "Order marked as served" : "Order marked as pending"
      );
    },
    onError: (error) => {
      console.error("Failed to update order:", error);
      toast.error("Failed to update order status");
    },
  });
}

export function useUpdateOrderPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, paid }: { id: string; paid: boolean }) =>
      updateOrderPaid(id, paid),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.list(data.idTenant),
      });
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
      toast.success(data.paid ? "Order marked as paid" : "Order marked as unpaid");
    },
    onError: (error) => {
      console.error("Failed to update order:", error);
      toast.error("Failed to update payment status");
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.list(data.idTenant),
      });
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
      queryClient.invalidateQueries({
        queryKey: ["meals"],
      });
      toast.success("Order deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete order:", error);
      toast.error("Failed to delete order");
    },
  });
}
