import OrderCard from "@/components/order-card";
import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { supabase } from "@/utils/supabase";

export default function OrdersScreen() {
  const { getUnpaidOrders, loading } = useOrderContext();
  const [orders, setOrders] = React.useState<IOrder[]>([]);

  async function onRefresh() {
    getUnpaidOrders().then((orders) => {
      setOrders(orders);
    });
  }

  React.useEffect(() => {
    getUnpaidOrders().then((orders) => {
      setOrders(orders);
    });
    const subscription = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          setOrders((prevOrders) => [payload.new as IOrder, ...prevOrders]);
        }
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Appbar.Header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
        <Appbar.Content
          titleStyle={{
            fontWeight: "bold",
          }}
          title="Pedidos Recientes"
        />
      </Appbar.Header>
      <View className="flex-1 ">
        <FlashList
          contentContainerStyle={{
            padding: 16,
          }}
          renderItem={({ item: order }) => <OrderCard order={order} />}
          data={orders}
          refreshing={loading}
          onRefresh={onRefresh}
          estimatedItemSize={200}
          ListEmptyComponent={
            <View className="flex flex-col gap-4 items-center justify-center mt-20">
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=200&id=119481&format=png&color=000000",
                }}
                style={{ width: 100, height: 100 }}
              />
              <Text style={{ color: "gray" }}>No hay items para mostrar</Text>
            </View>
          }
          horizontal={false}
        />
      </View>
    </>
  );
}
