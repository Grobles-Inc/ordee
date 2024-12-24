import * as React from "react";
import { createContext, useContext } from "react";
import { supabase } from "@/utils/supabase";
import { IOrder, IOrderContextProvider } from "@/interfaces";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "./auth";
export const OrderContext = createContext<IOrderContextProvider>({
  addOrder: async () => {},
  getUnservedOrders: async () => [],
  getOrderById: async (id: string): Promise<IOrder> => ({} as IOrder),
  orders: [],
  order: {} as IOrder,
  loading: false,
  getPaidOrders: async () => [],
  updateOrder: async () => {},
  deleteOrder: async () => {},
  getOrders: async () => [],
  updateOrderServedStatus: async () => {},
  paidOrders: [],
  updatePaidStatus: async () => {},
  getDailyPaidOrders: async () => [],
  getUnpaidOrders: async () => [],
});

export const OrderContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [orders, setOrders] = React.useState<IOrder[]>([]);
  const [order, setOrder] = React.useState<IOrder>({} as IOrder);
  const { profile } = useAuth();
  const [paidOrders, setPaidOrders] = React.useState<IOrder[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const subscription = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        async (payload) => {
          // Recargar los pedidos cuando haya cambios
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE" ||
            payload.eventType === "DELETE"
          ) {
            await getOrders();
            await getPaidOrders();
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addOrder = async (order: IOrder) => {
    setLoading(true);

    try {
      const { error: orderError } = await supabase.from("orders").insert({
        ...order,
        id_tenant: profile.id_tenant,
      });

      if (orderError) {
        if(orderError.code === 'P0001'){
          console.error('Error:', orderError.message);
          alert('Límite de 100 órdenes por día alcanzado para este negocio.');
        }
        else {
        console.error("Error inserting order:", orderError);
        alert("Error inserting order");
        }
        setLoading(false);
        return;
        
      }

      const updates = await Promise.all(
        order.items.map(async (meal) => {
          const { data: currentMeal, error: fetchError } = await supabase
            .from("meals")
            .select("quantity")
            .eq("id", meal.id)
            .eq("id_tenant", profile.id_tenant)
            .single();
          if (fetchError) {
            console.error("Error fetching meal quantity:", fetchError);
            alert("Error fetching meal quantity");
            return null;
          }
          const newQuantity = currentMeal.quantity - meal.quantity;
          return {
            id: meal.id,
            quantity: newQuantity,
            id_tenant: profile.id_tenant,
          };
        })
      );

      const validUpdates = updates.filter((update) => update !== null);

      const { error: mealsError } = await supabase
        .from("meals")
        .upsert(validUpdates);
      if (mealsError) {
        console.error("Error updating meals:", mealsError);
        setLoading(false);
        return;
      }

      if (!order.to_go) {
        const { error: tableError } = await supabase
          .from("tables")
          .update({ status: false })
          .eq("id", order.id_table);

        if (tableError) {
          console.error("Error updating table status:", tableError);
          setLoading(false);
          return;
        }
      }

      toast.success("Pedido agregado!", {
        icon: <FontAwesome name="check-circle" size={20} color="green" />,
      });
      router.back();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.success("Error al procesar pedido", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePaidStatus = async (id: string, paid: boolean) => {
    await supabase.from("orders").update({ paid }).eq("id", id).select();
    const { error } = await supabase
      .from("tables")
      .update({ status: true })
      .eq("id", order.id_table)
      .select();
    if (error) {
      toast.error("Error al actualizar estado de la mesa!", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
      return;
    }
    toast.success("Estado de la mesa actualizado!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
  };
  const getOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id_tenant", profile.id_tenant)
      .order("date", { ascending: false });
    if (error) throw error;
    setOrders(data);
    setLoading(false);
    return data;
  };

  async function getUnservedOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id_tenant", profile.id_tenant)
      .eq("served", false);
    if (error) throw error;
    setLoading(false);
    return data;
  }

  async function getPaidOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("paid", true)
      .eq("id_tenant", profile.id_tenant)
      .order("date", { ascending: false });
    if (error) throw error;
    setPaidOrders(data);
    setLoading(false);
    return data;
  }
  const updateOrderServedStatus = async (id: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("orders")
      .update({ served: true })
      .eq("id", id);
    if (error) throw error;
    toast.success("Pedido servido!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
    console.log("Order updated", error);
    setLoading(false);
  };

  const deleteOrder = async (id: string) => {
    setLoading(true);
    await supabase.from("orders").delete().eq("id", id);
    setLoading(false);
    toast.success("Pedido eliminado!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
  };

  async function getOrderById(id: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(
        "*, users:id_waiter(name), customers:id_fixed_customer(full_name)"
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    setLoading(false);
    setOrder(data);
    return data;
  }

  async function updateOrder(order: IOrder) {
    setLoading(true);
    const { error } = await supabase
      .from("orders")
      .update(order)
      .eq("id", order.id);
    toast.success("Pedido actualizado!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
    router.back();
    if (error) console.error("Update Error", error);
    setLoading(false);
  }

  async function getDailyPaidOrders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("paid", true)
      .eq("id_tenant", profile.id_tenant)
      .gte("date", today.toISOString())
      .order("date");
    if (error) throw error;
    setLoading(false);
    return data;
  }

  async function getUnpaidOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("paid", false)
      .eq("id_tenant", profile.id_tenant);
    if (error) throw error;
    setLoading(false);
    return data;
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        getOrders,
        deleteOrder,
        loading,
        getOrderById,
        paidOrders,
        getPaidOrders,
        getUnservedOrders,
        updateOrder,
        addOrder,
        updateOrderServedStatus,
        order,
        getDailyPaidOrders,
        updatePaidStatus,
        getUnpaidOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within a OrderProvider");
  }
  return context;
};
