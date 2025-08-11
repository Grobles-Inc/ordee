import { OrderItemsAccordion } from "@/components";
import { useAuth, useOrderContext } from "@/context";
import { IMeal, IOrder } from "@/interfaces";
import { FontAwesome } from "@expo/vector-icons";
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
    loading: orderLoading,
    deleteOrder,
    updateOrder,
    getOrdersCountByMonth,
    updatingOrder,
    setUpdatingOrder,
  } = useOrderContext();
  const { profile } = useAuth();
  const [count, setCount] = useState<number | null>(0);
  const [isRegisterDisabled, setIsRegisterDisabled] = useState(false);

  if (!profile) return null;

  useEffect(() => {
    getOrdersCountByMonth().then((count) => setCount(count));
  }, []);

  function onDelete() {
    console.log("data", updatingOrder);
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
              if (updatingOrder && updatingOrder.id && updatingOrder.id_table) {
                const itemsToRestore = updatingOrder.items.map((item) => ({
                  meal_id: item.id,
                  quantity: Number(item.quantity),
                }));

                await deleteOrder(
                  updatingOrder.id,
                  updatingOrder.id_table,
                  itemsToRestore
                );
                router.replace("/(auth)/(tabs)/orders");
              } else {
                console.error("No se pudo eliminar la orden: datos incompletos.");
                alert("No se pudo eliminar la orden, falta información.");
              }
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
  const { control, handleSubmit, reset, setValue } = useForm<IOrder>({
    defaultValues: {
      id_table: "",
      items: [] as IMeal[],
      paid: false,
      to_go: false,
      served: false,
      total: 0,
    },
  });

  useEffect(() => {
    if (updatingOrder) {
      setValue("id_table", updatingOrder.id_table);
      setValue("id_user", updatingOrder.id_user);
      setValue("paid", updatingOrder.paid);
      setValue("served", updatingOrder.served);
      setValue("to_go", updatingOrder.to_go);
      setValue("total", updatingOrder.total);
      setItemsSelected(updatingOrder?.items || []);
    }
  }, [id_order]);

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
      if (!profile || !profile.id_tenant) {
        throw new Error("El perfil del usuario no está disponible.");
      }
      const orderData: IOrder = {
        ...data,
        id_tenant: profile.id_tenant,
        served: updatingOrder?.served || data.served,
        to_go: data.to_go,
        id: updatingOrder?.id || data.id,
        id_user: updatingOrder?.id_user || data.id_user,
        paid: updatingOrder?.paid || data.paid,
        id_table: id_table,
        order_meals: itemsSelected,
        items: itemsSelected,
        total: itemsSelected.reduce(
          (acc, item) => acc + Number(item.quantity) * Number(item.price),
          0
        ),
      };

      await updateOrder(orderData);
      reset();
      setUpdatingOrder(null);
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
        order_meals: itemsSelected,
        items: itemsSelected,
        total: itemsSelected.reduce(
          (acc, item) => acc + Number(item.quantity) * Number(item.price),
          0
        ),
      };
      addOrder(orderData);

      reset();
      setItemsSelected([]);
    } catch (err) {
      console.error("An error occurred:", err);
      alert("Algo sucedió mal, vuelve a intentarlo.");
    }
  };

  return (
    <View className="web:md:w-1/2 web:md:mx-auto web:md:justify-center web:md:flex web:md:flex-col flex-1">
      <Appbar.Header
        style={{
          backgroundColor: "#FF6247",
        }}
      >
        <Appbar.BackAction
          onPress={() => {
            router.back();
            setUpdatingOrder(null);
          }}
          color="white"
        />
        <Appbar.Content
          title={`Mesa ${number}`}
          titleStyle={{ fontWeight: "bold", color: "white" }}
        />
        {updatingOrder && (
          <Appbar.Action
            icon="delete-outline"
            color="white"
            onPress={onDelete}
          />
        )}
      </Appbar.Header>
      <View className=" dark:bg-zinc-900 flex-1">
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View className="flex flex-col w-full items-center">
            <View className="w-full  overflow-hidden flex flex-col bg-white">
              <Controller
                control={control}
                name="to_go"
                render={({ field: { onChange, value } }) => (
                  <View className="flex flex-row justify-between items-center p-4 web:md:py-6">
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
        </ScrollView>
        <Button
          style={{
            margin: 20,
            position: "absolute",
            width: "90%",
            bottom: 36,
          }}
          mode="contained"
          onPress={updatingOrder ? handleSubmit(onUpdate) : handleSubmit(onAdd)}
          loading={orderLoading}
          disabled={isRegisterDisabled}
        >
          {updatingOrder ? "Guardar Cambios" : "Registrar Orden"}
        </Button>
      </View>
    </View>
  );
}
