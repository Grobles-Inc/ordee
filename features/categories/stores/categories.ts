import { create } from "zustand";

interface CategoriesUIState {
  selectedCategoryId: string | null;
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  categoryToDelete: string | null;
  searchQuery: string;

  setSelectedCategoryId: (id: string | null) => void;
  openAddDialog: () => void;
  closeAddDialog: () => void;
  openEditDialog: (id: string) => void;
  closeEditDialog: () => void;
  openDeleteDialog: (id: string) => void;
  closeDeleteDialog: () => void;
  setSearchQuery: (query: string) => void;
}

export const useCategoriesStore = create<CategoriesUIState>((set) => ({
  selectedCategoryId: null,
  isAddDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  categoryToDelete: null,
  searchQuery: "",

  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  openAddDialog: () => set({ isAddDialogOpen: true }),
  closeAddDialog: () => set({ isAddDialogOpen: false }),
  openEditDialog: (id) =>
    set({ isEditDialogOpen: true, selectedCategoryId: id }),
  closeEditDialog: () =>
    set({ isEditDialogOpen: false, selectedCategoryId: null }),
  openDeleteDialog: (id) =>
    set({ isDeleteDialogOpen: true, categoryToDelete: id }),
  closeDeleteDialog: () =>
    set({ isDeleteDialogOpen: false, categoryToDelete: null }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
