import { ICustomer, ICustomerContextProvider } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { FontAwesome } from "@expo/vector-icons";
import { createContext, useContext, useState } from "react";
import { Alert } from "react-native";
import { toast } from "sonner-native";
import { useAuth } from "./auth";

const CustomerContext = createContext<ICustomerContextProvider>({
  customer: {} as ICustomer,
  addCustomer: async () => {},
  customers: [],
  deleteCustomer: async () => {},
  getCustomers: async () => {},
  loading: false,
  getCustomerById: async () => {},
});

export function CustomerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const { profile } = useAuth();
  const [customer, setCustomer] = useState<ICustomer>({} as ICustomer);

  const getCustomerById = async (id: string) => {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("accounts")
        .select("*")
        .eq("id", id)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setCustomer(data);
        return data;
      }
      return null;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Profile Fetch Error", error.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customer: ICustomer) => {
    setLoading(true);
    const { error } = await supabase.from("fixed_customers").insert({
      ...customer,
      id_tenant: profile.id_tenant,
    });
    if (error) {
      toast.error("Error al agregar cliente!", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
      return;
    }
    toast.success("Cliente agregado!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
    setLoading(false);
  };

  const deleteCustomer = async (id: string) => {
    const { error } = await supabase
      .from("fixed_customers")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error al eliminar cliente!", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
      return;
    }
    toast.success("Cliente eliminado!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const getCustomers = async () => {
    const { data, error } = await supabase
      .from("fixed_customers")
      .select("*")
      .order("full_name")
      .eq("id_tenant", profile.id_tenant);
    if (error) throw error;
    setCustomers(data);
    return data;
  };

  return (
    <CustomerContext.Provider
      value={{
        loading,
        customer,
        getCustomerById,
        customers,
        addCustomer,
        deleteCustomer,
        getCustomers,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within an CustomerProvider");
  }
  return context;
};
