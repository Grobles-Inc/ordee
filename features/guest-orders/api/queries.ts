import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createGuestOrder, getGuestOrders } from "./db";
import type { GuestOrderData } from "./types";

export const guestOrderKeys = {
  all: ["guest-orders"] as const,
  lists: () => [...guestOrderKeys.all, "list"] as const,
  list: (guestId: string, tenantId: string) =>
    [...guestOrderKeys.lists(), guestId, tenantId] as const,
};

export function useGuestOrders(guestId: string, tenantId: string) {
  return useQuery({
    queryKey: guestOrderKeys.list(guestId, tenantId),
    queryFn: () => getGuestOrders(guestId, tenantId),
    enabled: !!guestId && !!tenantId,
  });
}

export function useCreateGuestOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      guestId,
      tenantId,
    }: {
      data: GuestOrderData;
      guestId: string;
      tenantId: string;
    }) => createGuestOrder(data, guestId, tenantId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: guestOrderKeys.list(variables.guestId, variables.tenantId),
      });
      queryClient.invalidateQueries({
        queryKey: ["meals"],
      });
      toast.success("Order placed successfully");
    },
    onError: (error) => {
      console.error("Failed to place order:", error);
      toast.error("Failed to place order");
    },
  });
}
