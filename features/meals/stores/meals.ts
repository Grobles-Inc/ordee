import { create } from "zustand";

interface MealsUIState {
  selectedMealId: string | null;
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isQuantityDialogOpen: boolean;
  mealToDelete: string | null;
  searchQuery: string;
  selectedCategoryId: string | null;

  setSelectedMealId: (id: string | null) => void;
  openAddDialog: () => void;
  closeAddDialog: () => void;
  openEditDialog: (id: string) => void;
  closeEditDialog: () => void;
  openDeleteDialog: (id: string) => void;
  closeDeleteDialog: () => void;
  openQuantityDialog: (id: string) => void;
  closeQuantityDialog: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategoryId: (id: string | null) => void;
}

export const useMealsStore = create<MealsUIState>((set) => ({
  selectedMealId: null,
  isAddDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  isQuantityDialogOpen: false,
  mealToDelete: null,
  searchQuery: "",
  selectedCategoryId: null,

  setSelectedMealId: (id) => set({ selectedMealId: id }),
  openAddDialog: () => set({ isAddDialogOpen: true }),
  closeAddDialog: () => set({ isAddDialogOpen: false }),
  openEditDialog: (id) =>
    set({ isEditDialogOpen: true, selectedMealId: id }),
  closeEditDialog: () =>
    set({ isEditDialogOpen: false, selectedMealId: null }),
  openDeleteDialog: (id) =>
    set({ isDeleteDialogOpen: true, mealToDelete: id }),
  closeDeleteDialog: () =>
    set({ isDeleteDialogOpen: false, mealToDelete: null }),
  openQuantityDialog: (id) =>
    set({ isQuantityDialogOpen: true, selectedMealId: id }),
  closeQuantityDialog: () =>
    set({ isQuantityDialogOpen: false, selectedMealId: null }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
}));
