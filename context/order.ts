import { IMeal, IOrder, IOrderContextProvider, ITable } from "@/interfaces";
import { supabase } from "@/utils";
import { addHours, endOfToday, startOfToday } from "date-fns";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { create } from "zustand";
import { useAuth } from "./auth";

interface OrderState extends IOrderContextProvider {
  setUnpaidOrders: (orders: IOrder[]) => void;
  setUpdatingOrder: (order: IOrder | null) => void;
  setOrder: (order: IOrder) => void;
  setPaidOrders: (orders: IOrder[]) => void;
  setLoading: (loading: boolean) => void;
  subscribeToOrders: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  unpaidOrders: [],
  updatingOrder: null,
  order: {} as IOrder,
  paidOrders: [],
  loading: false,
  setUnpaidOrders: (orders) => set({ unpaidOrders: orders }),
  setUpdatingOrder: (order) => set({ updatingOrder: order }),
  setOrder: (order) => set({ order }),
  setPaidOrders: (orders) => set({ paidOrders: orders }),
  setLoading: (loading) => set({ loading }),

  getOrdersCountByMonth: async (tenantId?: string) => {
    set({ loading: true });
    if (!tenantId) {
      set({ loading: false });
      return null;
    }
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const { error, count } = await supabase
      .from("orders")
      .select("*", { count: "exact" })
      .eq("id_tenant", tenantId)
      .gte("date", new Date(currentYear, currentMonth, 1).toISOString())
      .lt("date", new Date(currentYear, currentMonth + 1, 1).toISOString());
    if (error) throw error;
    set({ loading: false });
    return count;
  },

  getOrdersCountByDay: async (tenantId?: string) => {
    set({ loading: true });
    if (!tenantId) {
      set({ loading: false });
      return null;
    }
    const startOfDay = startOfToday(); // Local time start of today
    const endOfDay = endOfToday(); // Local time end of today
    const utcOffset = -5; // Peru is UTC-5
    const startOfDayUTC = addHours(startOfDay, -utcOffset); // Convert to UTC
    const endOfDayUTC = addHours(endOfDay, -utcOffset); // Convert to UTC
    const { error, count } = await supabase
      .from("orders")
      .select("*", { count: "exact" })
      .eq("id_tenant", tenantId)
      .gte("date", startOfDayUTC.toISOString())
      .lt("date", endOfDayUTC.toISOString());
    if (error) throw error;
    set({ loading: false });
    return count;
  },

  addOrder: async (order: IOrder, tenantId?: string) => {
    if (!tenantId) {
      toast.error("Error: ID de tenant no disponible");
      return;
    }

    try {
      const orderDataToInsert = {
        id_table: order.id_table,
        id_user: order.id_user,
        served: order.served,
        to_go: order.to_go,
        paid: order.paid,
        total: order.total,
        id_tenant: tenantId,
      };

      const { data: insertedOrderData, error: orderError } = await supabase
        .from("orders")
        .insert(orderDataToInsert)
        .select("id")
        .single();

      if (orderError) {
        if (orderError.code === "P0001") {
          console.error("Error:", orderError.message);
          alert("Límite de 100 órdenes por día alcanzado para este negocio.");
        } else {
          console.error("Error inserting order:", orderError);
          alert("Error inserting order");
        }
        set({ loading: false });
        return;
      }

      if (!insertedOrderData || !insertedOrderData.id) {
        console.error("Failed to retrieve inserted order ID");
        alert("Failed to retrieve inserted order ID");
        set({ loading: false });
        return;
      }

      const newOrderId = insertedOrderData.id;

      const orderMealsDataToInsert = order.order_meals.map((meal) => ({
        order_id: newOrderId,
        meal_id: meal.id,
        quantity: Number(meal.quantity),
      }));

      const { error: orderMealsError } = await supabase
        .from("order_meals")
        .insert(orderMealsDataToInsert);

      if (orderMealsError) {
        console.error("Error inserting order items:", orderMealsError);
        alert("Error inserting order items");
        set({ loading: false });
        return;
      }

      const mealStockUpdates = await Promise.all(
        order.order_meals.map(
          async (meal): Promise<Partial<IMeal> | null> => {
            const { data: currentMeal, error: fetchError } = await supabase
              .from("meals")
              .select("id, name, price, id_category, quantity, stock")
              .eq("id", meal.id)
              .eq("id_tenant", tenantId)
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
        set({ loading: false });
        return;
      }

      if (!order.to_go) {
        const { error: tableError } = await supabase
          .from("tables")
          .update({ status: false })
          .eq("id", order.id_table)
          .eq("id_tenant", tenantId);

        if (tableError) {
          console.error("Error updating table status:", tableError);
          alert("Order placed, but failed to update table status.");
        }
      }

      toast.success("Pedido agregado!");
      router.back();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.success("Error al procesar pedido");
    } finally {
      set({ loading: false });
    }
  },

  addTable: async (table: ITable, tenantId?: string) => {
    set({ loading: true });
    if (!tenantId) {
      toast.error("Error: ID de tenant no disponible");
      set({ loading: false });
      return;
    }
    const { error } = await supabase
      .from("tables")
      .insert({
        ...table,
        id_tenant: tenantId,
      });
    if (error) {
      console.error("Error adding table:", error);
      toast.error("Error al agregar mesa!");
      return;
    }
    toast.success("Mesa agregada!");
    set({ loading: false });
  },

  updatePaidStatus: async (id: string, paid: boolean) => {
    // Optimistic update - update paid status immediately
    const currentUnpaidOrders = get().unpaidOrders;
    const currentPaidOrders = get().paidOrders;
    
    if (paid) {
      // Move from unpaid to paid
      const orderToMove = currentUnpaidOrders.find(order => order.id === id);
      if (orderToMove) {
        const updatedUnpaidOrders = currentUnpaidOrders.filter(order => order.id !== id);
        const updatedPaidOrders = [{ ...orderToMove, paid: true }, ...currentPaidOrders];
        set({ 
          unpaidOrders: updatedUnpaidOrders, 
          paidOrders: updatedPaidOrders 
        });
      }
    }

    try {
      const { order } = get();
      await supabase.from("orders").update({ paid }).eq("id", id).select();
      const { error } = await supabase
        .from("tables")
        .update({ status: true })
        .eq("id", order.id_table)
        .select();
      
      if (error) {
        // Revert optimistic update on error
        set({ 
          unpaidOrders: currentUnpaidOrders, 
          paidOrders: currentPaidOrders 
        });
        toast.error("Error al actualizar estado de la mesa!");
        return;
      }

      toast.success("Estado de pago actualizado!");
    } catch (catchError) {
      // Revert optimistic update on error
      set({ 
        unpaidOrders: currentUnpaidOrders, 
        paidOrders: currentPaidOrders 
      });
      toast.error("Error al actualizar estado de pago!");
    }
  },

  getUnservedOrders: async (tenantId?: string) => {
    set({ loading: true });
    if (!tenantId) {
      set({ loading: false });
      return [];
    }
    const { data, error } = await supabase
      .from("orders")
      .select("*, tables(id, number)")
      .eq("id_tenant", tenantId)
      .eq("served", false);
    if (error) throw error;
    set({ loading: false });
    return data;
  },

  getPaidOrders: async (tenantId?: string) => {
    set({ loading: true });
    if (!tenantId) {
      set({ loading: false });
      return [];
    }
    const { data, error } = await supabase
      .from("orders")
      .select("*, tables(id, number), order_meals(quantity, meals(name))")
      .eq("paid", true)
      .eq("id_tenant", tenantId)
      .order("date", { ascending: false });
    if (error) throw error;
    set({ paidOrders: data });
    set({ loading: false });
    return data;
  },
  updateOrderServedStatus: async (id: string) => {
    // Optimistic update - mark as served immediately
    const currentUnpaidOrders = get().unpaidOrders;
    const updatedOrders = currentUnpaidOrders.map(order =>
      order.id === id ? { ...order, served: true } : order
    );
    set({ unpaidOrders: updatedOrders });

    try {
      const { error } = await supabase
        .from("orders")
        .update({ served: true })
        .eq("id", id);
      
      if (error) {
        // Revert optimistic update on error
        set({ unpaidOrders: currentUnpaidOrders });
        toast.error("Error al marcar como servido!");
        return;
      }

      toast.success("Pedido servido!");
    } catch (catchError) {
      // Revert optimistic update on error
      set({ unpaidOrders: currentUnpaidOrders });
      toast.error("Error al marcar como servido!");
    }
  },

  deleteOrder: async (
    orderId: string,
    tableId: string,
    itemsToRestore: { meal_id: string; quantity: number }[]
  ) => {
    set({ loading: true });

    const mealStockUpdates = await Promise.all(
      itemsToRestore.map(async (item) => {
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
          return null;
        }

        const newQuantity = currentMeal.quantity + item.quantity;
        return { id: item.meal_id, quantity: newQuantity };
      })
    );

    const validUpdates = mealStockUpdates.filter(
      (update) => update !== null
    ) as { id: string; quantity: number }[];

    if (validUpdates.length > 0) {
      const { error: mealError } = await supabase
        .from("meals")
        .upsert(validUpdates);
      if (mealError) {
        console.error("Error restoring meal quantities:", mealError);
        toast.error("Error al restaurar stock de platillos.");
      }
    }

    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (deleteError) {
      console.error("Error deleting order:", deleteError);
      toast.error("Error al eliminar el pedido.");
      set({ loading: false });
      return;
    }

    const { error: tableError } = await supabase
      .from("tables")
      .update({ status: true })
      .eq("id", tableId);

    if (tableError) {
      console.error("Error updating table status:", tableError);
      toast.error("Pedido eliminado, pero error al actualizar mesa.");
    }

    set({ loading: false });
    toast.success("Pedido eliminado!");
    set({ updatingOrder: null });
  },

  getOrderById: async (id: string) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("orders")
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
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    if (data && data.order_meals) {
      data.items = data.order_meals.map((om: any) => ({
        ...om.meals,
        quantity: om.quantity,
      }));
    }

    set({ loading: false });
    set({ order: data });
    return data;
  },

  updateOrder: async (order: IOrder) => {
    set({ loading: true });

    const { data: currentOrderMeals, error: fetchCurrentError } = await supabase
      .from("order_meals")
      .select("meal_id, quantity")
      .eq("order_id", order.id);

    if (fetchCurrentError) {
      console.error(
        "Error fetching current order items for update:",
        fetchCurrentError
      );
      toast.error("Error al obtener items actuales para actualizar.");
      set({ loading: false });
      return;
    }

    const currentMealsMap = new Map(
      currentOrderMeals.map((item) => [item.meal_id, item.quantity])
    );
    const newMealsMap = new Map(
      order.order_meals.map((item) => [item.id, Number(item.quantity)])
    );

    const stockAdjustments: { id: string; quantity: number }[] = [];

    const allMealIds = [
      ...new Set([...currentMealsMap.keys(), ...newMealsMap.keys()]),
    ];
    const { data: allMealsData, error: fetchMealsError } = await supabase
      .from("meals")
      .select("id, quantity")
      .in("id", allMealIds);

    if (fetchMealsError) {
      console.error("Error fetching meal data:", fetchMealsError);
        toast.error("Error al obtener datos de los platillos.");
      set({ loading: false });
      return;
    }

    const allMealsMap = new Map(
      allMealsData.map((meal) => [meal.id, meal.quantity])
    );

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

    if (stockAdjustments.length > 0) {
      for (const adjustment of stockAdjustments) {
        const { error: mealError } = await supabase
          .from("meals")
          .update({ quantity: adjustment.quantity })
          .eq("id", adjustment.id);

        if (mealError) {
          console.error("Error updating meal quantities:", mealError);
          toast.error("Error al actualizar el stock de los platillos.");
          set({ loading: false });
          return;
        }
      }
    }

    const { error: deleteError } = await supabase
      .from("order_meals")
      .delete()
      .eq("order_id", order.id);

    if (deleteError) {
      console.error("Error deleting old order items:", deleteError);
      toast.error("Error al eliminar items antiguos del pedido.");
      set({ loading: false });
      return;
    }

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
        toast.error("Error al insertar nuevos items del pedido.");
        set({ loading: false });
        return;
      }
    }

    const { order_meals, items, ...orderUpdateData } = order;
    const { error: updateOrderError } = await supabase
      .from("orders")
      .update(orderUpdateData)
      .eq("id", order.id);

    if (updateOrderError) {
      console.error("Update Order Error", updateOrderError);
      toast.error("Error al actualizar el pedido.");
    } else {
      toast.success("Pedido actualizado!");
      router.back();
    }
    set({ loading: false });
    set({ updatingOrder: null });
  },

  getDailyPaidOrders: async (tenantId?: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    set({ loading: true });
    if (!tenantId) {
      set({ loading: false });
      return [];
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("paid", true)
      .eq("id_tenant", tenantId)
      .gte("date", today.toISOString())
      .order("date");
    if (error) throw error;
    set({ loading: false });
    return data;
  },

  getUnpaidOrders: async (tenantId?: string) => {
    if (!tenantId) {
      set({ unpaidOrders: [] });
      return [];
    }
    const { data, error } = await supabase
      .from("orders")
      .select("*, tables(id, number), order_meals(quantity, meals(name))")
      .eq("paid", false)
      .eq("id_tenant", tenantId)
      .order("date", { ascending: false });
    if (error) throw error;
    set({ unpaidOrders: data });
    return data;
  },
  subscribeToOrders: (tenantId?: string) => {
    if (!tenantId) return () => {};

    // Initial fetch of all orders
    Promise.all([
      get().getUnservedOrders(tenantId),
      get().getPaidOrders(tenantId),
      get().getUnpaidOrders(tenantId),
    ])

    // Subscribe to changes
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders' 
        },
        (payload) => {
          // Handle different types of changes
          switch (payload.eventType) {
            case 'INSERT':
              // New order created - fetch pending orders
              get().getUnservedOrders(tenantId)
              get().getUnpaidOrders(tenantId)
              break
            case 'UPDATE':
              // Order updated - fetch all lists to ensure correct state
              Promise.all([
                get().getUnservedOrders(tenantId),
                get().getPaidOrders(tenantId),
                get().getUnpaidOrders(tenantId),
              ])
              break
            case 'DELETE':
              // Order deleted - fetch all lists to ensure correct state
              Promise.all([
                get().getUnservedOrders(tenantId),
                get().getPaidOrders(tenantId),
                get().getUnpaidOrders(tenantId),
              ])
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


