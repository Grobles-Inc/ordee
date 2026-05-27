import { create } from "zustand";
import type { OrderItem } from "../api/types";

interface OrdersUIState {
  selectedOrderId: string | null;
  isCreateDialogOpen: boolean;
  isAddItemsDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  orderToDelete: string | null;
  statusFilter: "all" | "pending" | "served" | "paid";
  searchQuery: string;
  cart: OrderItem[];

  setSelectedOrderId: (id: string | null) => void;
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  openAddItemsDialog: (id: string) => void;
  closeAddItemsDialog: () => void;
  openDeleteDialog: (id: string) => void;
  closeDeleteDialog: () => void;
  setStatusFilter: (filter: "all" | "pending" | "served" | "paid") => void;
  setSearchQuery: (query: string) => void;
  addToCart: (item: OrderItem) => void;
  removeFromCart: (mealId: string) => void;
  updateCartQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useOrdersStore = create<OrdersUIState>((set, get) => ({
  selectedOrderId: null,
  isCreateDialogOpen: false,
  isAddItemsDialogOpen: false,
  isDeleteDialogOpen: false,
  orderToDelete: null,
  statusFilter: "all",
  searchQuery: "",
  cart: [],

  setSelectedOrderId: (id) => set({ selectedOrderId: id }),
  openCreateDialog: () => set({ isCreateDialogOpen: true }),
  closeCreateDialog: () => set({ isCreateDialogOpen: false, cart: [] }),
  openAddItemsDialog: (id) =>
    set({ isAddItemsDialogOpen: true, selectedOrderId: id }),
  closeAddItemsDialog: () =>
    set({ isAddItemsDialogOpen: false, cart: [] }),
  openDeleteDialog: (id) =>
    set({ isDeleteDialogOpen: true, orderToDelete: id }),
  closeDeleteDialog: () =>
    set({ isDeleteDialogOpen: false, orderToDelete: null }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  addToCart: (item) => {
    const { cart } = get();
    const existing = cart.find((i) => i.mealId === item.mealId);
    if (existing) {
      set({
        cart: cart.map((i) =>
          i.mealId === item.mealId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      });
    } else {
      set({ cart: [...cart, item] });
    }
  },
  removeFromCart: (mealId) => {
    set({ cart: get().cart.filter((i) => i.mealId !== mealId) });
  },
  updateCartQuantity: (mealId, quantity) => {
    if (quantity <= 0) {
      set({ cart: get().cart.filter((i) => i.mealId !== mealId) });
    } else {
      set({
        cart: get().cart.map((i) =>
          i.mealId === mealId ? { ...i, quantity } : i
        ),
      });
    }
  },
  clearCart: () => set({ cart: [] }),
}));
