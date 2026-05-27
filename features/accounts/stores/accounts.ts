import { create } from "zustand";

interface AccountsUIState {
  selectedAccountId: string | null;
  isAddUserDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  accountToDelete: string | null;

  setSelectedAccountId: (id: string | null) => void;
  openAddUserDialog: () => void;
  closeAddUserDialog: () => void;
  openDeleteDialog: (id: string) => void;
  closeDeleteDialog: () => void;
}

export const useAccountsStore = create<AccountsUIState>((set) => ({
  selectedAccountId: null,
  isAddUserDialogOpen: false,
  isDeleteDialogOpen: false,
  accountToDelete: null,

  setSelectedAccountId: (id) => set({ selectedAccountId: id }),
  openAddUserDialog: () => set({ isAddUserDialogOpen: true }),
  closeAddUserDialog: () => set({ isAddUserDialogOpen: false }),
  openDeleteDialog: (id) =>
    set({ isDeleteDialogOpen: true, accountToDelete: id }),
  closeDeleteDialog: () =>
    set({ isDeleteDialogOpen: false, accountToDelete: null }),
}));
