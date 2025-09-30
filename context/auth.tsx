import { IAuthContextProvider, IUser } from "@/interfaces";
import { supabase } from "@/utils";
import { FontAwesome } from "@expo/vector-icons";
import { Session } from "@supabase/supabase-js";
import { router, useSegments } from "expo-router";
import { useEffect } from "react";
import { toast } from "sonner-native";
import { create } from "zustand";

interface AuthState extends IAuthContextProvider {
  setLoading: (loading: boolean) => void;
  setProfile: (profile: IUser | null) => void;
  setUsers: (users: IUser[]) => void;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  loading: false,
  profile: {} as IUser,
  users: [],
  session: null,
  setLoading: (loading) => set({ loading }),
  setProfile: (profile: IUser | null) => set({ profile: profile || {} as IUser }),
  setUsers: (users) => set({ users }),
  setSession: (session) => set({ session }),
  signOut: async () => {
    await supabase.auth.signOut();
  },
  updateProfile: async (user: IUser) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("accounts")
      .update(user)
      .eq("id", user.id);
    if (error) {
      toast.error("Error al actualizar perfil!", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
      console.log("ERROR", error);
      return;
    }
    toast.success("Perfil actualizado!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
    await get().getProfile(user.id);
    set({ loading: false });
    return data;
  },
  getProfile: async (id: string, retryCount = 3) => {
    set({ loading: true });
    try {
      const { data, error, status } = await supabase
        .from("accounts")
        .select("*, tenants:id_tenant(*,*,plans(*))")
        .eq("id", id);

      if (error) {
        if (status !== 406 && retryCount > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return get().getProfile(id);
        }
        throw error;
      }

      if (!data || data.length === 0) {
        console.log("No profile found in accounts, user might be new");
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata) {
          const { error: createError } = await supabase
            .from("accounts")
            .insert({
              id: user.id,
              name: user.user_metadata.name || user.user_metadata.full_name || "Usuario",
              last_name: user.user_metadata.lastName || user.user_metadata.last_name || "",
              role: "admin",
              image_url: "",
            });

          if (createError) {
            console.error("Error creating profile:", createError);
          } else {
            return get().getProfile(id);
          }
        }
        set({ profile: {} as IUser });
        return;
      }

      set({ profile: data[0] });
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error("Error al obtener el perfil!");
      set({ profile: {} as IUser });
      router.replace("/(public)/sign-in");
    } finally {
      set({ loading: false });
    }
  },
  deleteUser: async (id: string) => {
    set({ loading: true });
    const { error } = await supabase
      .from("accounts")
      .update({
        disabled: true,
      })
      .eq("id", id);
    if (error) {
      toast.error("Error al eliminar usuario!", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
      console.log("ERROR", error);
      return;
    }
    toast.success("Usuario eliminado!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
    set({ loading: false });
  },
  getUsers: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("id_tenant", get().profile?.id_tenant)
      .neq("id", get().profile?.id)
      .eq("disabled", false)
      .order("name", { ascending: false });
    if (error) throw error;
    set({ users: data });
    set({ loading: false });
    return data;
  },
}));

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, setSession, getProfile, setProfile, setUsers } = useAuthStore();
  const segments = useSegments();

  useEffect(() => {
    async function initializeAuth() {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      setSession(initialSession);
      if (initialSession?.user) {
        await getProfile(initialSession.user.id);
      }
    }
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (_event === "SIGNED_OUT") {
          setSession(null);
          setProfile(null);
          router.replace("/(public)/sign-in");
        } else if (newSession?.user) {
          setSession(newSession);
          await getProfile(newSession.user.id);
        }
      }
    );
    initializeAuth();
    return () => {
      authListener.subscription.unsubscribe();
      setProfile(null);
      setSession(null);
      setUsers([]);
    };
  }, []);

  useEffect(() => {
    const handleNavigation = async () => {
      if (!session && segments[0] !== "(public)") {
        await router.replace("/(public)/sign-in");
      } else if (session && segments[0] !== "(auth)") {
        await router.replace("/(auth)/(tabs)");
      }
    };

    handleNavigation();
  }, [session, segments]);

  return (
    <>
      {children}
    </>
  );
}

export const useAuth = useAuthStore;
