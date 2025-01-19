import { IAuthContextProvider, IUser } from "@/interfaces";
import { supabase } from "@/utils";
import { FontAwesome } from "@expo/vector-icons";
import { Session } from "@supabase/supabase-js";
import { useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner-native";
const AuthContext = createContext<IAuthContextProvider>({
  signOut: () => {},
  updateProfile: () => {},
  session: null,
  getProfile: async () => {},
  deleteUser: async () => {},
  getUsers: async () => {},
  users: [],
  profile: {} as IUser,
  loading: false,
});

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<IUser | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const segments = useSegments();
  const router = useRouter();
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
      if (!profile && segments[0] !== "(public)") {
        await router.replace("/(public)/sign-in");
      } else if (profile && segments[0] !== "(auth)") {
        await router.replace("/(auth)/(tabs)");
      }
    };

    handleNavigation();
  }, [profile, segments]);

  const getProfile = async (id: string, retryCount = 3) => {
    setLoading(true);
    try {
      const { data, error, status } = await supabase
        .from("accounts")
        .select("*, tenants:id_tenant(*,*,plans(*))")
        .eq("id", id)
        .single();

      if (error) {
        if (status !== 406 && retryCount > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return getProfile(id, retryCount - 1);
        }
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error("Error al obtener el perfil!");
    } finally {
      setLoading(false);
    }
  };

  async function signOut() {
    await supabase.auth.signOut();
    setUsers([]);
    setSession(null);
    setProfile(null);
  }

  const deleteUser = async (id: string) => {
    setLoading(true);
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
    setLoading(false);
  };

  const updateProfile = async (user: IUser) => {
    setLoading(true);
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
    await getProfile(user.id);
    setLoading(false);
    return data;
  };
  const getUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("id_tenant", profile?.id_tenant)
      .neq("id", profile?.id)
      .eq("disabled", false)
      .order("name", { ascending: false });
    if (error) throw error;
    setUsers(data);
    setLoading(false);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        profile: profile || ({} as IUser),
        session,
        signOut,
        getProfile,
        deleteUser,
        updateProfile,
        getUsers,
        users,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
