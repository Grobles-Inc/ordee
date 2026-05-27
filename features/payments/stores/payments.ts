import { create } from "zustand";

interface PaymentsUIState {
  selectedOrderId: string | null;
  isReceiptOpen: boolean;
  searchQuery: string;

  setSelectedOrderId: (id: string | null) => void;
  openReceipt: (id: string) => void;
  closeReceipt: () => void;
  setSearchQuery: (query: string) => void;
}

export const usePaymentsStore = create<PaymentsUIState>((set) => ({
  selectedOrderId: null,
  isReceiptOpen: false,
  searchQuery: "",

  setSelectedOrderId: (id) => set({ selectedOrderId: id }),
  openReceipt: (id) => set({ isReceiptOpen: true, selectedOrderId: id }),
  closeReceipt: () => set({ isReceiptOpen: false, selectedOrderId: null }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
