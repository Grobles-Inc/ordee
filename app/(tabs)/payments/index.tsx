import OrderCard from "@/components/payment-card";
import { OrderCardSkeleton } from "@/components/skeleton/card";
import { useOrderContext } from "@/context";
import { supabase } from "@/utils/supabase";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaidOrdersScreen() {
  const { paidOrders, getPaidOrders, loading } = useOrderContext();
  async function onRefresh() {
    await getPaidOrders();
  }
  React.useEffect(() => {
    getPaidOrders();
    supabase.channel("db-changes").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
      },
      (payload) => {
        getPaidOrders();
      }
    );
  }, []);

  return (
    <>
      <Appbar.Header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
        <Appbar.Content
          titleStyle={{ fontWeight: "bold" }}
          title="Pedidos Pagados"
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
          refreshing={loading}
          contentContainerStyle={{
            padding: 16,
          }}
          onRefresh={onRefresh}
          renderItem={({ item: order }) => <OrderCard order={order} />}
          data={paidOrders}
          estimatedItemSize={200}
          horizontal={false}
          ListEmptyComponent={
            <SafeAreaView className="flex flex-col gap-4 items-center justify-center mt-20">
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/17768/17768859.png",
                }}
                style={{ width: 100, height: 100, opacity: 0.5 }}
              />
              <Text style={{ color: "gray" }}>No hay items para mostrar</Text>
            </SafeAreaView>
          }
        />
      </View>
    </>
  );
}
