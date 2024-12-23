import CustomerFinder from "@/components/customer-finder";
import OrderItemsAccordion from "@/components/items";
import { useAuth, useOrderContext } from "@/context";
import { useCustomer } from "@/context/customer";
import { IMeal, IOrder } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { Appbar, Button, Divider, Switch, Text } from "react-native-paper";
import { toast } from "sonner-native";

export default function AddOrderScreen() {
  const { number, id_table, id_order } = useLocalSearchParams<{
    number: string;
    id_table: string;
    id_order: string;
  }>();
  const [itemsSelected, setItemsSelected] = useState<IMeal[]>([]);
  const [toGo, setToGo] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState<IOrder | null>(null);
  const { addOrder, updateOrder, loading: orderLoading } = useOrderContext();
  const { profile } = useAuth();
  const { getCustomers, customers } = useCustomer();
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isRegisterDisabled, setIsRegisterDisabled] = useState(false);

  async function getOrderById(id: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();
    setUpdatingOrder(data);
    if (!data) return;
    if (error) {
      console.error("Error getting order:", error);
      alert("Error al obtener o pedido");
    }
    return;
  }

  useEffect(() => {
    getCustomers();
  }, []);

  useEffect(() => {
    if (id_order) {
      getOrderById(id_order);
    }
  }, [id_order]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<IOrder>({
    defaultValues: {
      id_table: updatingOrder?.id_table,
      id_fixed_customer: updatingOrder?.id_fixed_customer
        ? updatingOrder?.id_fixed_customer
        : "",
      items: [] as IMeal[],
      paid: updatingOrder?.paid,
      served: updatingOrder?.served,
      total: updatingOrder?.total,
    },
  });

  const onUpdate = async (data: IOrder) => {
    if (data.items.length === 0) {
      toast.error("Orden sin productos", {
        description: "Debes agregar al menos un producto a la orden",
        duration: 6000,
        icon: <FontAwesome name="exclamation-triangle" size={24} />,
      });
      return;
    }
    try {
      const orderData: IOrder = {
        ...data,
        served: updatingOrder?.served || data.served,
        to_go: updatingOrder?.to_go || data.to_go,
        id: updatingOrder?.id || data.id,
        id_waiter: updatingOrder?.id_waiter || data.id_waiter,
        paid: updatingOrder?.paid || data.paid,
        id_fixed_customer:
          updatingOrder?.id_fixed_customer || data.id_fixed_customer || null,
        id_table: id_table,
        total: 100,
      };

      await updateOrder(orderData);
      reset();

      if (data.free) {
        const selectedCustomer = customers.find(
          (c) => c.id === data.id_fixed_customer
        );
        if (selectedCustomer) {
          await supabase
            .from("fixed_customers")
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
        id_waiter: profile.id,
        paid: false,
        id_table: id_table,
        items: itemsSelected,
        id_fixed_customer: data.id_fixed_customer
          ? data.id_fixed_customer
          : null,
        total: itemsSelected.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0
        ),
      };

      // console.log(JSON.stringify(orderData));
      addOrder(orderData);
      if (data.free) {
        const selectedCustomer = customers.find(
          (c) => c.id === data.id_fixed_customer
        );
        console.log("selectedCustomer", selectedCustomer);
        if (selectedCustomer) {
          await supabase
            .from("fixed_customers")
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
        <Appbar.Action icon="restore" color="white" onPress={() => reset()} />
      </Appbar.Header>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="bg-zinc-100"
      >
        <View className="flex flex-col w-full items-center  ">
          <View className="w-full  overflow-hidden flex flex-col bg-white">
            <Controller
              control={control}
              name="id_fixed_customer"
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
                        setValue("id_fixed_customer", undefined);
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
                (c) => c.id === watch("id_fixed_customer")
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

            <View className="flex flex-row gap-2 justify-between items-center p-4">
              <View>
                <Text variant="bodyLarge">Orden para llevar</Text>
              </View>
              <Switch value={toGo} onValueChange={() => setToGo(!toGo)} />
            </View>
            <Divider />
            <OrderItemsAccordion
              items={itemsSelected}
              setItems={setItemsSelected}
            />
          </View>
          <View className="flex flex-col justify-center align-middle w-full gap-4 p-4">
            <Button
              mode="contained"
              style={{ marginTop: 40 }}
              onPress={
                updatingOrder ? handleSubmit(onUpdate) : handleSubmit(onAdd)
              }
              loading={orderLoading}
              disabled={isRegisterDisabled}
            >
              {updatingOrder ? "Editar Orden" : "Registrar Orden"}
            </Button>
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
    </>
  );
}
