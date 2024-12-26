import { IAuthContextProvider, IUser } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { FontAwesome } from "@expo/vector-icons";
import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { toast } from "sonner-native";
const AuthContext = createContext<IAuthContextProvider>({
  signOut: () => {},
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
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState<IUser | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    async function initializeAuth() {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      setSession(initialSession);
      if (initialSession?.user) {
        await getProfile(initialSession.user.id);
      }
      setIsReady(true);
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
    };
  }, []);

  const getProfile = async (id: string) => {
    setLoading(true);
    const { data, error, status } = await supabase
      .from("accounts")
      .select("*, tenants:id_tenant(name, logo)")
      .eq("id", id)
      .single();
    if (error && status !== 406) {
      console.log("PROFILE ERROR", error);
    }
    setProfile(data);
    setLoading(false);
  };

  function signOut() {
    supabase.auth.signOut();
  }

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

  if (!isReady) {
    return <ActivityIndicator color="tomato" style={{ marginTop: 100 }} />;
  }
  return (
    <AuthContext.Provider
      value={{
        loading,
        profile: profile || ({} as IUser),
        session,
        signOut,
        getProfile,
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
