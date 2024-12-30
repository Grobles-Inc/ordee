import OrderCard from "@/components/order-card";
import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { ActivityIndicator, Appbar, Text } from "react-native-paper";
import { supabase } from "@/utils/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderCardSkeleton } from "@/components/skeleton/card";

export default function OrdersScreen() {
  const { getUnpaidOrders, loading, unpaidOrders } = useOrderContext();
  async function onRefresh() {
    getUnpaidOrders();
  }
  React.useEffect(() => {
    getUnpaidOrders();
    const subscription = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          getUnpaidOrders();
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
        {loading && (
          <View className="flex flex-col gap-2 p-4">
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </View>
        )}
        <FlashList
          contentContainerStyle={{
            padding: 16,
          }}
          renderItem={({ item: order }) => <OrderCard order={order} />}
          data={unpaidOrders}
          refreshing={loading}
          onRefresh={onRefresh}
          estimatedItemSize={200}
          ListEmptyComponent={
            <SafeAreaView className="flex flex-col gap-4 items-center justify-center mt-20">
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/17768/17768778.png",
                }}
                style={{ width: 100, height: 100, opacity: 0.5 }}
              />
              <Text style={{ color: "gray" }}>No hay items para mostrar</Text>
            </SafeAreaView>
          }
          horizontal={false}
        />
      </View>
    </>
  );
}
