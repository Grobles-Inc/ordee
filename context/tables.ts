import { ITable, ITablesContextProvider } from "@/interfaces";
import { supabase } from "@/utils";
import { create } from "zustand";
import { toast } from "sonner-native";
import { useAuth } from "./auth";

interface TablesState extends ITablesContextProvider {
  setTables: (tables: ITable[]) => void;
  setLoading: (loading: boolean) => void;
  subscribeToTables: (tenantId?: string) => () => void;
}

export const useTablesStore = create<TablesState>((set, get) => ({
  tables: [],
  loading: false,
  setTables: (tables) => set({ tables }),
  setLoading: (loading) => set({ loading }),

  addTable: async (table: ITable, tenantId?: string) => {
    if (!tenantId) {
      toast.error("Error: ID de tenant no disponible");
      return;
    }

    // Optimistic update - add table immediately
    const tempId = `temp_${Date.now()}`;
    const optimisticTable = { ...table, id: tempId, id_tenant: tenantId };
    const currentTables = get().tables;
    set({ tables: [...currentTables, optimisticTable] });

    try {
      const { data, error } = await supabase
        .from("tables")
        .insert({
          ...table,
          id_tenant: tenantId,
        })
        .select()
        .single();

      if (error) {
        // Revert optimistic update on error
        set({ tables: currentTables });
        toast.error("Error al agregar mesa!");
        return;
      }

      // Replace temp table with real one
      const updatedTables = get().tables.map(t => 
        t.id === tempId ? data : t
      );
      set({ tables: updatedTables });
      toast.success("Mesa agregada!");

    } catch (catchError) {
      // Revert optimistic update on error
      set({ tables: currentTables });
      toast.error("Error al agregar mesa!");
    }
  },

  getTables: async (tenantId?: string) => {
    set({ loading: true });
    
    if (!tenantId) {
      set({ loading: false, tables: [] });
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from("tables")
        .select("*")
        .eq("id_tenant", tenantId)
        .neq("disabled", true);
      
      if (error) {
        set({ tables: [], loading: false });
        return null;
      }
      
      const finalTables = data || [];
      set({ tables: finalTables, loading: false });
      
      return data;
      
    } catch (catchError) {
      set({ tables: [], loading: false });
      return null;
    }
  },

  updateTableStatus: async (id: string, status: boolean) => {
    // Optimistic update - update status immediately
    const currentTables = get().tables;
    const updatedTables = currentTables.map(table =>
      table.id === id ? { ...table, status } : table
    );
    set({ tables: updatedTables });

    try {
      const { error } = await supabase
        .from("tables")
        .update({ status })
        .eq("id", id);

      if (error) {
        // Revert optimistic update on error
        set({ tables: currentTables });
        toast.error("Error al actualizar estado de la mesa!");
        return;
      }

      toast.success("Estado de mesa actualizado!");

    } catch (catchError) {
      // Revert optimistic update on error
      set({ tables: currentTables });
      toast.error("Error al actualizar estado de la mesa!");
    }
  },

  deleteTable: async (id: string) => {
    // Optimistic update - remove table immediately
    const currentTables = get().tables;
    const updatedTables = currentTables.filter(table => table.id !== id);
    set({ tables: updatedTables });

    try {
      const { error } = await supabase
        .from("tables")
        .update({ disabled: true })
        .eq("id", id);

      if (error) {
        // Revert optimistic update on error
        set({ tables: currentTables });
        toast.error("Error al eliminar mesa!");
        return;
      }

      toast.success("Mesa eliminada!");

    } catch (catchError) {
      // Revert optimistic update on error
      set({ tables: currentTables });
      toast.error("Error al eliminar mesa!");
    }
  },

  subscribeToTables: (tenantId?: string) => {
    if (!tenantId) return () => {};
    
    get().getTables(tenantId);
    const channel = supabase
      .channel("tables-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "tables" }, () => get().getTables(tenantId))
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
