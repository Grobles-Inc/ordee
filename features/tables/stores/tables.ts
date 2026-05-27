import { create } from "zustand";

interface TablesUIState {
  selectedTableId: string | null;
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  tableToDelete: string | null;
  viewMode: "grid" | "list";

  setSelectedTableId: (id: string | null) => void;
  openAddDialog: () => void;
  closeAddDialog: () => void;
  openEditDialog: (id: string) => void;
  closeEditDialog: () => void;
  openDeleteDialog: (id: string) => void;
  closeDeleteDialog: () => void;
  setViewMode: (mode: "grid" | "list") => void;
}

export const useTablesStore = create<TablesUIState>((set) => ({
  selectedTableId: null,
  isAddDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  tableToDelete: null,
  viewMode: "grid",

  setSelectedTableId: (id) => set({ selectedTableId: id }),
  openAddDialog: () => set({ isAddDialogOpen: true }),
  closeAddDialog: () => set({ isAddDialogOpen: false }),
  openEditDialog: (id) =>
    set({ isEditDialogOpen: true, selectedTableId: id }),
  closeEditDialog: () =>
    set({ isEditDialogOpen: false, selectedTableId: null }),
  openDeleteDialog: (id) =>
    set({ isDeleteDialogOpen: true, tableToDelete: id }),
  closeDeleteDialog: () =>
    set({ isDeleteDialogOpen: false, tableToDelete: null }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));
