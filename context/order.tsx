import * as React from "react";
import { createContext, useContext } from "react";
import { supabase } from "@/utils";
import { IOrder, IOrderContextProvider, ITable, IMeal } from "@/interfaces";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { startOfToday, endOfToday, addHours } from "date-fns";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "./auth";
export const OrderContext = createContext<IOrderContextProvider>({
  addOrder: async () => { },
  getUnservedOrders: async () => [],
  getOrdersCountByDay: async () => 0,
  addTable: async () => { },
  updatingOrder: null,
  setUpdatingOrder: () => { },
  getOrderById: async (id: string): Promise<IOrder> => ({} as IOrder),
  getOrdersCountByMonth: async () => 0,
  order: {} as IOrder,
  loading: false,
  getPaidOrders: async () => [],
  updateOrder: async () => { },
  deleteOrder: async (orderId: string, tableId: string, itemsToRestore: { meal_id: string; quantity: number }[]) => { },
  updateOrderServedStatus: async () => { },
  paidOrders: [],
  updatePaidStatus: async () => { },
  unpaidOrders: [],
  getDailyPaidOrders: async () => [],
  getUnpaidOrders: async () => [],
});

export const OrderContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [unpaidOrders, setUnpaidOrders] = React.useState<IOrder[]>([]);
  const [updatingOrder, setUpdatingOrder] = React.useState<IOrder | null>(null);
  const [order, setOrder] = React.useState<IOrder>({} as IOrder);
  const { profile } = useAuth();
  const [paidOrders, setPaidOrders] = React.useState<IOrder[]>([]);
  const [loading, setLoading] = React.useState(false);

  const getOrdersCountByMonth = async () => {
    setLoading(true);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const { error, count } = await supabase
      .from("orders")
      .select("*", { count: "exact" })
      .eq("id_tenant", profile.id_tenant)
      .gte("date", new Date(currentYear, currentMonth, 1).toISOString())
      .lt("date", new Date(currentYear, currentMonth + 1, 1).toISOString());
    if (error) throw error;
    setLoading(false);
    return count;
  };

  const getOrdersCountByDay = async () => {
    setLoading(true);
    const startOfDay = startOfToday(); // Local time start of today
    const endOfDay = endOfToday(); // Local time end of today
    const utcOffset = -5; // Peru is UTC-5
    const startOfDayUTC = addHours(startOfDay, -utcOffset); // Convert to UTC
    const endOfDayUTC = addHours(endOfDay, -utcOffset); // Convert to UTC
    const { error, count } = await supabase
      .from("orders")
      .select("*", { count: "exact" })
      .eq("id_tenant", profile.id_tenant)
      .gte("date", startOfDayUTC.toISOString())
      .lt("date", endOfDayUTC.toISOString());
    if (error) throw error;
    setLoading(false);
    return count;
  };

  const addOrder = async (order: IOrder) => {
    setLoading(true);

    try {
      // 1. Prepare order data (excluding items)
      const orderDataToInsert = {
        id_table: order.id_table,
        id_user: order.id_user,
        served: order.served,
        to_go: order.to_go,
        paid: order.paid,
        total: order.total,
        id_tenant: profile.id_tenant,
      };

      // 2. Insert the main order record and get its ID
      const { data: insertedOrderData, error: orderError } = await supabase
        .from("orders")
        .insert(orderDataToInsert)
        .select("id") // Select the ID of the newly inserted order
        .single(); // Expecting a single record back

      if (orderError) {
        if (orderError.code === "P0001") {
          console.error("Error:", orderError.message);
          alert("Límite de 100 órdenes por día alcanzado para este negocio.");
        } else {
          console.error("Error inserting order:", orderError);
          alert("Error inserting order");
        }
        setLoading(false);
        return;
      }

      if (!insertedOrderData || !insertedOrderData.id) {
        console.error("Failed to retrieve inserted order ID");
        alert("Failed to retrieve inserted order ID");
        setLoading(false);
        return;
      }

      const newOrderId = insertedOrderData.id;

      // 3. Prepare items for the order_meals table
      const orderMealsDataToInsert = order.order_meals.map((meal) => ({
        order_id: newOrderId,
        meal_id: meal.id,
        quantity: Number(meal.quantity)
      }));

      // 4. Insert items into the order_meals table
      const { error: orderMealsError } = await supabase
        .from("order_meals")
        .insert(orderMealsDataToInsert);

      if (orderMealsError) {
        console.error("Error inserting order items:", orderMealsError);
        alert("Error inserting order items");
        setLoading(false);
        return;
      }

      const mealStockUpdates = await Promise.all(
        order.order_meals.map(
          async (meal): Promise<Partial<IMeal> | null> => {
            const { data: currentMeal, error: fetchError } = await supabase
              .from("meals")
              .select("id, name, price, id_category, quantity, stock")
              .eq("id", meal.id)
              .eq("id_tenant", profile.id_tenant)
              .single();

            if (fetchError) {
              console.error("Error fetching meal:", fetchError);
              alert("Error fetching meal");
              return null;
            }

            if (!currentMeal) {
              console.error("Meal not found during stock update:", meal.id);
              alert(`Meal with ID ${meal.id} not found.`);
              return null;
            }

            return {
              ...currentMeal,
              quantity: currentMeal.quantity - Number(meal.quantity),
            };
          }
        )
      );

      const validMealStockUpdates = mealStockUpdates.filter(
        (update) => update !== null
      ) as Partial<IMeal>[];

      const { error: mealsError } = await supabase
        .from("meals")
        .upsert(validMealStockUpdates);

      if (mealsError) {
        console.error("Error updating meals:", mealsError);
        alert("Order placed, but failed to update meal stock.");
        setLoading(false);
        return;
      }

      if (!order.to_go) {
        const { error: tableError } = await supabase
          .from("tables")
          .update({ status: false })
          .eq("id", order.id_table)
          .eq("id_tenant", profile.id_tenant);

        if (tableError) {
          console.error("Error updating table status:", tableError);
          alert("Order placed, but failed to update table status.");
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

  async function addTable(table: ITable) {
    setLoading(true);
    const { error } = await supabase
      .from("tables")
      .insert({
        ...table,
        id_tenant: profile.id_tenant,
      });
    if (error) {
      console.error("Error adding table:", error);
      toast.error("Error al agregar mesa!", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
      return;
    }
    toast.success("Mesa agregada!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
    setLoading(false);
  }

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
  };

  async function getUnservedOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, tables(id, number)")
      .eq("id_tenant", profile?.id_tenant)
      .eq("served", false);
    if (error) throw error;
    setLoading(false);
    return data;
  }

  async function getPaidOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, tables(id, number), order_meals(quantity, meals(name))")
      .eq("paid", true)
      .eq("id_tenant", profile?.id_tenant)
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
    setLoading(false);
  };

  const deleteOrder = async (orderId: string, tableId: string, itemsToRestore: { meal_id: string; quantity: number }[]) => {
    setLoading(true);

    // 1. Restore meal quantities before deleting the order
    // (Doing this first avoids issues if order deletion fails after stock is adjusted)
    const mealStockUpdates = await Promise.all(
      itemsToRestore.map(async (item) => {
        // Fetch current quantity
        const { data: currentMeal, error: fetchError } = await supabase
          .from("meals")
          .select("quantity")
          .eq("id", item.meal_id)
          .single();

        if (fetchError || !currentMeal) {
          console.error(
            `Error fetching quantity for meal ${item.meal_id} during delete:`,
            fetchError
          );
          return null; // Skip update if fetch fails
        }

        // Calculate new quantity
        const newQuantity = currentMeal.quantity + item.quantity;
        return { id: item.meal_id, quantity: newQuantity };
      })
    );

    // Filter out any null results from failed fetches
    const validUpdates = mealStockUpdates.filter(
      (update) => update !== null
    ) as { id: string; quantity: number }[];

    if (validUpdates.length > 0) {
      const { error: mealError } = await supabase
        .from("meals")
        .upsert(validUpdates);
      if (mealError) {
        console.error("Error restoring meal quantities:", mealError);
        toast.error("Error al restaurar stock de platillos.", {
          icon: <FontAwesome name="times-circle" size={20} color="red" />,
        });
        // Decide if you should proceed with order deletion or stop
        // setLoading(false); // Maybe stop here
        // return;
      }
    }

    // 2. Delete the order (ON DELETE CASCADE handles order_meals)
    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (deleteError) {
      console.error("Error deleting order:", deleteError);
      toast.error("Error al eliminar el pedido.", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
      // Note: Meal stock might already be restored. Consider implications.
      setLoading(false);
      return;
    }

    // 3. Update the table status to "available" (status = true)
    // Actualizar el estado de la mesa a "libre" (status = true)
    const { error: tableError } = await supabase
      .from("tables")
      .update({ status: true }) // Assuming true means available
      .eq("id", tableId);

    if (tableError) {
      console.error("Error updating table status:", tableError);
      toast.error("Pedido eliminado, pero error al actualizar mesa.", {
        icon: <FontAwesome name="exclamation-circle" size={20} color="orange" />,
      });
      // Don't return, order is already deleted.
      // setLoading(false);
      // return;
    }

    setLoading(false);
    toast.success("Pedido eliminado!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
    setUpdatingOrder(null);
  };

  async function getOrderById(id: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders") // Start from orders table
      .select(
        `
        *,
        users:id_user(*),
        tenants:id_tenant(name, logo),
        tables:id_table(number),
        order_meals!inner (
          quantity,
          meals!inner ( * )
        )
      `
      ) // Join order_meals and then meals
      .eq("id", id) // Filter by order ID
      .single(); // Expect a single order

    if (error) throw error;

    // Patch: flatten order_meals into items
    if (data && data.order_meals) {
      data.items = data.order_meals.map((om: any) => ({
        ...om.meals,
        quantity: om.quantity,
      }));
    }

    setLoading(false);
    setOrder(data);
    return data;
  }

  async function updateOrder(order: IOrder) {
    setLoading(true);

    // 1. Fetch current order items to calculate stock differences
    const { data: currentOrderMeals, error: fetchCurrentError } =
      await supabase
        .from("order_meals")
        .select("meal_id, quantity")
        .eq("order_id", order.id);

    if (fetchCurrentError) {
      console.error(
        "Error fetching current order items for update:",
        fetchCurrentError
      );
      toast.error("Error al obtener items actuales para actualizar.", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
      setLoading(false);
      return;
    }

    // 2. Create maps for easier lookup
    const currentMealsMap = new Map(
      currentOrderMeals.map((item) => [item.meal_id, item.quantity])
    );
    const newMealsMap = new Map(
      order.order_meals.map((item) => [item.id, Number(item.quantity)])
    );

    const stockAdjustments: { id: string; quantity: number }[] = [];

    // 3. Fetch all relevant meal data in one go
    const allMealIds = [
      ...new Set([...currentMealsMap.keys(), ...newMealsMap.keys()]),
    ];
    const { data: allMealsData, error: fetchMealsError } = await supabase
      .from("meals")
      .select("id, quantity")
      .in("id", allMealIds);

    if (fetchMealsError) {
      console.error("Error fetching meal data:", fetchMealsError);
      toast.error("Error al obtener datos de los platillos.", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
      setLoading(false);
      return;
    }

    const allMealsMap = new Map(
      allMealsData.map((meal) => [meal.id, meal.quantity])
    );

    // 4. Calculate stock changes
    for (const [mealId, currentQuantity] of allMealsMap.entries()) {
      const oldQuantity = currentMealsMap.get(mealId) || 0;
      const newQuantity = newMealsMap.get(mealId) || 0;
      const quantityDiff = oldQuantity - newQuantity;

      if (quantityDiff !== 0) {
        stockAdjustments.push({
          id: mealId,
          quantity: currentQuantity + quantityDiff,
        });
      }
    }

    // 5. Update meal stocks
    if (stockAdjustments.length > 0) {
      const { error: mealError } = await supabase
        .from("meals")
        .upsert(stockAdjustments);

      if (mealError) {
        console.error("Error updating meal quantities:", mealError);
        toast.error("Error al actualizar el stock de los platillos.", {
          icon: <FontAwesome name="times-circle" size={20} color="red" />,
        });
        setLoading(false);
        return;
      }
    }

    // 6. Delete old order_meals entries
    const { error: deleteError } = await supabase
      .from("order_meals")
      .delete()
      .eq("order_id", order.id);

    if (deleteError) {
      console.error("Error deleting old order items:", deleteError);
      toast.error("Error al eliminar items antiguos del pedido.", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
      setLoading(false);
      return;
    }

    // 7. Insert new order_meals entries
    const newOrderMealsData = order.order_meals.map((item) => ({
      order_id: order.id,
      meal_id: item.id,
      quantity: Number(item.quantity),
    }));

    if (newOrderMealsData.length > 0) {
      const { error: insertError } = await supabase
        .from("order_meals")
        .insert(newOrderMealsData);
      if (insertError) {
        console.error("Error inserting new order items:", insertError);
        toast.error("Error al insertar nuevos items del pedido.", {
          icon: <FontAwesome name="times-circle" size={20} color="red" />,
        });
        setLoading(false);
        return;
      }
    }

    // 8. Update the main order details
    const { order_meals, ...orderUpdateData } = order;
    const { error: updateOrderError } = await supabase
      .from("orders")
      .update(orderUpdateData)
      .eq("id", order.id);

    if (updateOrderError) {
      console.error("Update Order Error", updateOrderError);
      toast.error("Error al actualizar el pedido.", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
    } else {
      toast.success("Pedido actualizado!", {
        icon: <FontAwesome name="check-circle" size={20} color="green" />,
      });
      router.back();
    }
    setLoading(false);
    setUpdatingOrder(null);
  }

  async function getDailyPaidOrders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("paid", true)
      .eq("id_tenant", profile?.id_tenant)
      .gte("date", today.toISOString())
      .order("date");
    if (error) throw error;
    setLoading(false);
    return data;
  }

  async function getUnpaidOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*, tables(id, number), order_meals(quantity, meals(name))")
      .eq("paid", false)
      .eq("id_tenant", profile?.id_tenant)
      .order("date", { ascending: false });
    if (error) throw error;
    setUnpaidOrders(data);
    return data;
  }

  return (
    <OrderContext.Provider
      value={{
        unpaidOrders,
        deleteOrder,
        loading,
        getOrderById,
        paidOrders,
        getPaidOrders,
        getUnservedOrders,
        updatingOrder,
        updateOrder,
        addOrder,
        setUpdatingOrder,
        addTable,
        updateOrderServedStatus,
        order,
        getOrdersCountByDay,
        getDailyPaidOrders,
        getOrdersCountByMonth,
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
