import { IMeal, IMealContextProvider } from "@/interfaces";
import { supabase } from "@/utils";
import { create } from "zustand";
import { toast } from "sonner-native";
import { useAuth } from "./auth";
import { generateDestroySignature } from "@/utils/cloudinary";

interface MealState extends IMealContextProvider {
  setMeals: (meals: IMeal[]) => void;
  setLoading: (loading: boolean) => void;
  subscribeToMeals: (tenantId?: string) => () => void;
}

export const useMealStore = create<MealState>((set, get) => ({
  meals: [],
  loading: false,
  setMeals: (meals) => set({ meals }),
  setLoading: (loading) => set({ loading }),
  addMeal: async (meal: IMeal, tenantId?: string) => {
    if (!tenantId) {
      toast.error("Error: ID de tenant no disponible");
      return;
    }

    // Optimistic update - add meal immediately
    const tempId = `temp_${Date.now()}`;
    const optimisticMeal = { ...meal, id: tempId, id_tenant: tenantId };
    const currentMeals = get().meals;
    set({ meals: [...currentMeals, optimisticMeal] });

    try {
      const { data, error } = await supabase
        .from("meals")
        .insert({
          ...meal,
          id_tenant: tenantId,
        })
        .select()
        .single();

      if (error) {
        // Revert optimistic update on error
        set({ meals: currentMeals });
        console.error("Error adding meal:", error);
        toast.error("Error al agregar item!");
        return;
      }

      // Replace temp meal with real one
      const updatedMeals = get().meals.map(m => 
        m.id === tempId ? data : m
      );
      set({ meals: updatedMeals });
      toast.success("Item agregado al menú!");

    } catch (catchError) {
      // Revert optimistic update on error
      set({ meals: currentMeals });
      toast.error("Error al agregar item!");
    }
  },
  updateMeal: async (meal: IMeal) => {
    // Optimistic update - update meal immediately
    const currentMeals = get().meals;
    const updatedMeals = currentMeals.map(m =>
      m.id === meal.id ? { ...m, ...meal } : m
    );
    set({ meals: updatedMeals });

    try {
      const { error } = await supabase
        .from("meals")
        .update(meal)
        .eq("id", meal.id);

      if (error) {
        // Revert optimistic update on error
        set({ meals: currentMeals });
        console.error("Error updating meal:", error);
        toast.error("Error al actualizar item!");
        return;
      }
    } catch (catchError) {
      // Revert optimistic update on error
      set({ meals: currentMeals });
      toast.error("Error al actualizar item!");
    }
  },
  getMealsByCategoryId: async (id: string, tenantId?: string) => {
    set({ loading: true });
    if (!tenantId) {
      set({ loading: false });
      return [];
    }
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("id_category", id)
      .eq("stock", true)
      .eq("id_tenant", tenantId);
    if (error) throw error;
    set({ loading: false });
    return data;
  },
  getDailyMeals: async (tenantId?: string) => {
    set({ loading: true });
    if (!tenantId) {
      set({ loading: false, meals: [] });
      return [];
    }
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("id_tenant", tenantId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching daily meals:", error);
      set({ meals: [], loading: false });
      return null;
    }

    set({ meals: data || [], loading: false });
    return data;
  },
  changeMealAvailability: async (id: string, quantity: number) => {
    // Optimistic update - update quantity immediately
    const currentMeals = get().meals;
    const updatedMeals = currentMeals.map(meal =>
      meal.id === id ? { ...meal, quantity } : meal
    );
    set({ meals: updatedMeals });

    try {
      const { error } = await supabase
        .from("meals")
        .update({ quantity })
        .eq("id", id);

      if (error) {
        // Revert optimistic update on error
        set({ meals: currentMeals });
        console.error("Error updating meal:", error);
        toast.error("Error al actualizar item!");
        return;
      }

      toast.success("Item actualizado!");
    } catch (catchError) {
      // Revert optimistic update on error
      set({ meals: currentMeals });
      toast.error("Error al actualizar item!");
    }
  },
  deleteMeal: async (id: string, cloudinaryPublicId: string) => {
    // Optimistic update - remove meal immediately
    const currentMeals = get().meals;
    const updatedMeals = currentMeals.filter(meal => meal.id !== id);
    set({ meals: updatedMeals });

    try {
      const { error } = await supabase.from("meals").delete().eq("id", id);
      if (error) {
        // Revert optimistic update on error
        set({ meals: currentMeals });
        console.error("Error deleting meal:", error);
        toast.error("Error al eliminar item!");
        return;
      }

      // Delete from Cloudinary
      const { signature, timestamp, apiKey } = await generateDestroySignature(
        cloudinaryPublicId
      );
      const formData = new FormData();
      formData.append("public_id", cloudinaryPublicId);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp.toString());
      formData.append("api_key", apiKey);
      await fetch("https://api.cloudinary.com/v1_1/diqe1byxy/image/destroy", {
        method: "POST",
        body: formData,
      });

    } catch (catchError) {
      // Revert optimistic update on error
      set({ meals: currentMeals });
      toast.error("Error al eliminar item!");
    }
  },
  getMealById: async (id: string) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("meals")
      .select("*, categories:id_category(name)")
      .eq("id", id)
      .single();
    if (error) console.error("Error fetching meal:", error);
    set({ loading: false });
    return data;
  },
  subscribeToMeals: (tenantId?: string) => {
    if (!tenantId) return () => {};

    // Initial fetch of all meals
    get().getDailyMeals(tenantId);

    // Subscribe to changes
    const channel = supabase
      .channel('meals-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'meals' 
        },
        (payload) => {
          // Handle different types of changes
          switch (payload.eventType) {
            case 'INSERT':
              // New meal created - fetch meals
              get().getDailyMeals(tenantId)
              break
            case 'UPDATE':
              // Meal updated - fetch meals
              get().getDailyMeals(tenantId)
              break
            case 'DELETE':
              // Meal deleted - fetch meals
              get().getDailyMeals(tenantId)
              break
          }
        }
      )
      .subscribe()

    // Return cleanup function
    return () => {
      channel.unsubscribe()
    }
  }
}));

