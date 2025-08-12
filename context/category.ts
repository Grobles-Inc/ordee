import { ICategory, ICategoryContextProvider } from "@/interfaces";
import { supabase } from "@/utils";
import { getPlanLimits, isCategoryLimitReached } from "@/utils/limiter";
import { create } from "zustand";
import { Alert } from "react-native";
import { toast } from "sonner-native";
import { useAuth } from "./auth";

interface CategoryState extends ICategoryContextProvider {
  setCategories: (categories: ICategory[]) => void;
  setCategory: (category: ICategory) => void;
  setLoading: (loading: boolean) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  category: {} as ICategory,
  loading: false,
  setCategories: (categories) => set({ categories }),
  setCategory: (category) => set({ category }),
  setLoading: (loading) => set({ loading }),
  addCategory: async (category: ICategory, tenantId?: string) => {
    if (!tenantId) {
      toast.error("Error: ID de tenant no disponible");
      return;
    }

    const { limits } = await getPlanLimits(tenantId);

    if (await isCategoryLimitReached(tenantId)) {
      Alert.alert(
        "Límite de Plan Excedido",
        `Su plan actual permite un máximo de ${limits.categories} categorías. Por favor, actualice su plan para agregar más categorías.`
      );
      return;
    }

    // Optimistic update - add category immediately
    const tempId = `temp_${Date.now()}`;
    const optimisticCategory = { ...category, id: tempId, id_tenant: tenantId };
    const currentCategories = get().categories;
    set({ categories: [...currentCategories, optimisticCategory] });

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          ...category,
          id_tenant: tenantId,
        })
        .select()
        .single();

      if (error) {
        // Revert optimistic update on error
        set({ categories: currentCategories });
        toast.error("Error al agregar categoría!");
        return;
      }

      // Replace temp category with real one
      const updatedCategories = get().categories.map(c => 
        c.id === tempId ? data : c
      );
      set({ categories: updatedCategories });
      toast.success("Categoría agregada al menú!");

    } catch (catchError) {
      // Revert optimistic update on error
      set({ categories: currentCategories });
      toast.error("Error al agregar categoría!");
    }
  },
  getCategories: async (tenantId?: string) => {
    set({ loading: true });
    if (!tenantId) {
      set({ loading: false, categories: [] });
      return [];
    }
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id_tenant", tenantId);
    if (error) {
      console.error("Error getting categories:", error);
      set({ categories: [], loading: false });
      return [];
    }
    set({ categories: data || [], loading: false });
    return data;
  },
  deleteCategory: async (id: string, tenantId?: string) => {
    if (!tenantId) {
      toast.error("Error: ID de tenant no disponible");
      return;
    }

    // Check for associated meals first
    const { data: mealsWithCategory, error } = await supabase
      .from("meals")
      .select("id")
      .eq("id_category", id)
      .eq("id_tenant", tenantId);
    
    if (error) {
      console.error("Error finding meals with category:", error);
      toast.error("Error al eliminar categoría!");
      return;
    }
    
    if (mealsWithCategory.length > 0) {
      toast.error("ERROR : Categoría en uso", {
        description:
          "La categoria tiene " +
          mealsWithCategory.length +
          " platos asociados",
      });
      return;
    }

    // Optimistic update - remove category immediately
    const currentCategories = get().categories;
    const updatedCategories = currentCategories.filter(category => category.id !== id);
    set({ categories: updatedCategories });

    try {
      const { error: deleteError } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
      
      if (deleteError) {
        // Revert optimistic update on error
        set({ categories: currentCategories });
        console.error("Error deleting category:", deleteError);
        toast.error("Error al eliminar categoría!");
        return;
      }

      toast.success("Categoría eliminada!");
    } catch (catchError) {
      // Revert optimistic update on error
      set({ categories: currentCategories });
      toast.error("Error al eliminar categoría!");
    }
  },
  getCategoryById: async (id: string) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    set({ category: data });
    set({ loading: false });
    return data;
  },
}));



