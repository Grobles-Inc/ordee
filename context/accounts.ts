import { IAccount, IAccountState } from "@/interfaces";
import { supabase } from "@/utils";
import { create } from "zustand";
import { toast } from "sonner-native";

export const useAccountsStore = create<IAccountState>((set, get) => ({
  accounts: [],
  loading: false,
  setAccounts: (accounts: IAccount[]) => set({ accounts }),
  setLoading: (loading: boolean) => set({ loading }),

  getEnabledAccounts: async (tenantId?: string) => {
    set({ loading: true });
    if (!tenantId) {
      set({ loading: false, accounts: [] });
      return null;
    }
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("id_tenant", tenantId)
        .neq("disabled", true);

      if (error) {
        set({ accounts: [], loading: false });
        toast.error("Error al obtener cuentas");
        return null;
      }
      set({ accounts: data || [], loading: false });
      return data || [];
    } catch {
      set({ accounts: [], loading: false });
      toast.error("Error al obtener cuentas");
      return null;
    }
  },

  addAccount: async (account: IAccount, tenantId?: string) => {
    if (!tenantId) {
      toast.error("Error: ID de tenant no disponible");
      return;
    }
    const tempId = `temp_${Date.now()}`;
    const optimisticAccount = { ...account, id: tempId, id_tenant: tenantId };
    const currentAccounts = get().accounts;
    set({ accounts: [...currentAccounts, optimisticAccount] });

    try {
      const { data, error } = await supabase
        .from("accounts")
        .insert({ ...account, id_tenant: tenantId })
        .select()
        .single();

      if (error) {
        set({ accounts: currentAccounts });
        toast.error("Error al agregar cuenta");
        return;
      }
      const updatedAccounts = get().accounts.map(a =>
        a.id === tempId ? data : a
      );
      set({ accounts: updatedAccounts });
      toast.success("Cuenta agregada!");
    } catch {
      set({ accounts: currentAccounts });
      toast.error("Error al agregar cuenta");
    }
  },

  updateAccount: async (id: string, updates: Partial<IAccount>) => {
    const currentAccounts = get().accounts;
    const updatedAccounts = currentAccounts.map(acc =>
      acc.id === id ? { ...acc, ...updates } : acc
    );
    set({ accounts: updatedAccounts });

    try {
      const { error } = await supabase
        .from("accounts")
        .update(updates)
        .eq("id", id);

      if (error) {
        set({ accounts: currentAccounts });
        toast.error("Error al actualizar cuenta");
        return;
      }
      toast.success("Cuenta actualizada!");
    } catch {
      set({ accounts: currentAccounts });
      toast.error("Error al actualizar cuenta");
    }
  },

  deleteAccount: async (id: string) => {
    const currentAccounts = get().accounts;
    const updatedAccounts = currentAccounts.filter(acc => acc.id !== id);
    set({ accounts: updatedAccounts });

    try {
      const { error } = await supabase
        .from("accounts")
        .update({ disabled: true })
        .eq("id", id);

      if (error) {
        set({ accounts: currentAccounts });
          toast.error("Error al eliminar cuenta");
        return;
      }
      toast.success("Cuenta eliminada!");
    } catch {
      set({ accounts: currentAccounts });
      toast.error("Error al eliminar cuenta");
    }
  },

  subscribeToAccounts: (tenantId?: string) => {
    if (!tenantId) return () => {};
    const channel = supabase
      .channel(`accounts-${tenantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "ordee",
          table: "accounts",
          filter: `id_tenant=eq.${tenantId}`,
        },
        async () => {
          await get().getEnabledAccounts(tenantId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
