import CustomerFinder from "@/components/customer-finder";
import OrderItemsAccordion from "@/components/items";
import { useAuth, useOrderContext } from "@/context";
import { useCustomer } from "@/context/customer";
import { IMeal, IOrder } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { FontAwesome } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";
import { Appbar, Button, Divider, Switch, Text } from "react-native-paper";
import { toast } from "sonner-native";

export default function AddOrderScreen() {
  const { number, id_table, id_order } = useLocalSearchParams<{
    number: string;
    id_table: string;
    id_order: string;
  }>();
  const [itemsSelected, setItemsSelected] = useState<IMeal[]>([]);
  const {
    addOrder,
    updateOrder,
    loading: orderLoading,
    deleteOrder,
    getOrdersCountByMonth,
    getOrderForUpdate,
    updatingOrder,
  } = useOrderContext();
  const { profile } = useAuth();
  const { getCustomers, customers } = useCustomer();
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [count, setCount] = useState<number | null>(0);
  const [isRegisterDisabled, setIsRegisterDisabled] = useState(false);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  if (count === 500) {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Límite de órdenes alcanzado",
        body: "Se ha alcanzado el límite de 500 órdenes para este mes",
      },
      trigger: 2,
    });
  }
  if (!profile) return null;

  useEffect(() => {
    getCustomers();
    getOrdersCountByMonth().then((count) => setCount(count));
  }, []);

  useEffect(() => {
    if (id_order) {
      getOrderForUpdate(id_order);
    }
  }, [id_order]);

  function onDelete() {
    Alert.alert(
      "Eliminar orden",
      "Esta acción eliminara la orden, ¿estás seguro?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Aceptar",
          onPress: async () => {
            try {
              await deleteOrder(updatingOrder?.id as string);
              router.replace("/orders");
            } catch (err) {
              console.error("An error occurred:", err);
              alert("Algo sucedió mal, vuelve a intentarlo.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  }

  function onReset() {
    Alert.alert(
      "Resetear order",
      "Esta acción limpiara todos los datos de la orden, ¿estás seguro?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Aceptar",
          onPress: async () => {
            try {
              reset();
              setItemsSelected([]);
              router.back();
            } catch (err) {
              console.error("An error occurred:", err);
              alert("Algo sucedió mal, vuelve a intentarlo.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  }
  const { control, handleSubmit, reset, setValue, watch } = useForm<IOrder>({
    defaultValues: {
      id_table: updatingOrder?.id_table,
      id_customer: updatingOrder?.id_customer ? updatingOrder?.id_customer : "",
      items: updatingOrder?.items || ([] as IMeal[]),
      paid: updatingOrder?.paid,
      to_go: updatingOrder?.to_go,
      served: updatingOrder?.served,
      total: updatingOrder?.total,
    },
  });

  const onUpdate = async (data: IOrder) => {
    if (itemsSelected.length === 0) {
      toast.error("Orden sin productos", {
        description: "Debes agregar al menos un producto a la orden",
        duration: 6000,
        icon: <FontAwesome name="exclamation-triangle" size={24} color="red" />,
      });
      return;
    }
    try {
      const orderData: IOrder = {
        ...data,
        served: updatingOrder?.served || data.served,
        to_go: data.to_go,
        id: updatingOrder?.id || data.id,
        id_user: updatingOrder?.id_user || data.id_user,
        paid: updatingOrder?.paid || data.paid,
        id_customer: updatingOrder?.id_customer || data.id_customer || null,
        id_table: id_table,
        items: itemsSelected,
        total: itemsSelected.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0
        ),
      };

      await updateOrder(orderData);
      reset();

      if (data.free) {
        const selectedCustomer = customers.find(
          (c) => c.id === data.id_customer
        );
        if (selectedCustomer) {
          await supabase
            .from("customers")
            .update({
              total_free_orders: selectedCustomer.total_free_orders - 1,
            })
            .eq("id", selectedCustomer.id);
        }
      }
    } catch (err) {
      console.error("An error occurred:", err);
      alert("Algo sucedió mal, vuelve a intentarlo.");
    }
  };

  const onAdd = async (data: IOrder) => {
    if (!profile.id) return;
    if (itemsSelected.length === 0) {
      toast.error("Orden sin productos", {
        description:
          "Debes agregar al menos un producto a la orden para proceder.",
        duration: 6000,
        icon: <FontAwesome name="exclamation-triangle" size={24} color="red" />,
      });
      return;
    }
    try {
      const orderData: IOrder = {
        ...data,
        served: false,
        to_go: data.to_go,
        id_user: profile.id,
        paid: false,
        id_table: id_table,
        items: itemsSelected,
        id_customer: data.id_customer || null,
        total: itemsSelected.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0
        ),
      };
      addOrder(orderData);
      if (data.free) {
        const selectedCustomer = customers.find(
          (c) => c.id === data.id_customer
        );
        console.log("selectedCustomer", selectedCustomer);
        if (selectedCustomer) {
          await supabase
            .from("customers")
            .update({
              total_free_orders: selectedCustomer.total_free_orders - 1,
            })
            .eq("id", selectedCustomer.id);
        }
      }
      reset();
      setItemsSelected([]);
    } catch (err) {
      console.error("An error occurred:", err);
      alert("Algo sucedió mal, vuelve a intentarlo.");
    }
  };

  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: "#FF6247",
        }}
      >
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
          color="white"
        />
        <Appbar.Content
          title={`Mesa ${number}`}
          titleStyle={{ fontWeight: "bold", color: "white" }}
        />
        <Appbar.Action
          icon={updatingOrder ? "delete-outline" : "eraser"}
          color="white"
          onPress={updatingOrder ? onDelete : onReset}
        />
      </Appbar.Header>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="bg-zinc-100 dark:bg-zinc-900"
      >
        <View className="flex flex-col w-full items-center  ">
          <View className="w-full  overflow-hidden flex flex-col bg-white dark:bg-zinc-900">
            <Controller
              control={control}
              name="id_customer"
              render={({ field: { value } }) => (
                <View className="flex flex-row gap-2 justify-between items-center p-4 w-full">
                  <View>
                    <Text variant="bodyLarge">Cliente Fijo</Text>
                    {value && (
                      <Text variant="bodyMedium" className="opacity-60">
                        {(() => {
                          const customer = customers.find(
                            (c) => c.id === value
                          );
                          return (
                            <>
                              {customer?.full_name} -{" "}
                              {customer?.total_free_orders} pedidos gratis
                            </>
                          );
                        })()}
                      </Text>
                    )}
                  </View>
                  <Switch
                    value={!!value}
                    onValueChange={(checked) => {
                      if (checked) {
                        setShowCustomerModal(true);
                      } else {
                        setValue("id_customer", undefined);
                        setValue("free", false);
                      }
                    }}
                  />
                </View>
              )}
            />
            <Divider />

            {(() => {
              const selectedCustomer = customers.find(
                (c) => c.id === watch("id_customer")
              );
              return (selectedCustomer?.total_free_orders ?? 0) > 0 ? (
                <>
                  <Controller
                    control={control}
                    name="free"
                    render={({ field: { onChange, value } }) => (
                      <View className="flex flex-row gap-2 justify-between items-center p-4">
                        <View>
                          <Text variant="titleMedium">Orden Gratuita</Text>
                        </View>
                        <Switch value={value} onValueChange={onChange} />
                      </View>
                    )}
                  />
                  <Divider />
                </>
              ) : null;
            })()}

            <Controller
              control={control}
              name="to_go"
              render={({ field: { onChange, value } }) => (
                <View className="flex flex-row justify-between items-center p-4">
                  <Text variant="bodyLarge">Orden para llevar</Text>
                  <Switch value={value} onValueChange={onChange} />
                </View>
              )}
            />
            <Divider />
            <OrderItemsAccordion
              items={itemsSelected}
              setItems={setItemsSelected}
            />
          </View>
        </View>

        <CustomerFinder
          watch={watch}
          setValue={setValue}
          setIsRegisterDisabled={setIsRegisterDisabled}
          showCustomerModal={showCustomerModal}
          setShowCustomerModal={setShowCustomerModal}
        />
      </ScrollView>
      <Button
        mode="contained"
        style={{
          position: "absolute",
          bottom: 40,
          left: 8,
          right: 8,
          marginHorizontal: 20,
        }}
        onPress={updatingOrder ? handleSubmit(onUpdate) : handleSubmit(onAdd)}
        loading={orderLoading}
        disabled={isRegisterDisabled}
      >
        {updatingOrder ? "Guardar Cambios" : "Registrar Orden"}
      </Button>
    </>
  );
}
