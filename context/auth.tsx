import { IAuthContextProvider, IUser } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { FontAwesome } from "@expo/vector-icons";
import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner-native";
const AuthContext = createContext<IAuthContextProvider>({
  signOut: () => {},
  updateProfile: async () => {},
  session: null,
  getProfile: async () => {},
  deleteUser: async () => {},
  getUsers: async () => {},
  users: [],
  profile: null,
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
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const getProfile = async () => {
    setLoading(true);
    const { data, error, status } = await supabase
      .from("accounts")
      .select("*")
      .eq("id", session?.user?.id)
      .single();
    if (error && status !== 406) {
      console.log("PROFILE ERROR", error);
    }
    setProfile(data);
    setLoading(false);
  };

  function signOut() {
    supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  }

  const updateProfile = async (userData: Partial<IUser>) => {
    setLoading(true);
    const updates = {
      ...userData,
      id: profile?.id,
      updated_at: new Date(),
    };
    const { error } = await supabase.from("accounts").upsert(updates);
    if (error) console.log("UPDATE PROFILE ERROR", error);
    toast.success("Perfil actualizado!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
    setLoading(false);
  };

  const deleteUser = async (id: string) => {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) {
      toast.error("Error al eliminar usuario!", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
      return;
    }
    toast.success("Usuario eliminado!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
    setUsers(users.filter((user) => user.id !== id));
  };

  const getUsers = async (id_tenant: string) => {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("id_tenant", id_tenant)
      .order("name");
    if (error) throw error;
    setUsers(data);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        profile,
        session,
        signOut,
        getProfile,
        updateProfile,
        deleteUser,
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
