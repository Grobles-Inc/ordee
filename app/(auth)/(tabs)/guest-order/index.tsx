import { GuestOrderCard } from "@/components";
import { useOrderStore } from "@/context/order";
import { IOrder } from "@/interfaces";
import { supabase } from "@/utils";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { ScrollView } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [orders, setOrders] = React.useState<IOrder[]>();
  const { getUnservedOrders, loading } = useOrderStore();
  React.useEffect(() => {
    getUnservedOrders().then((orders) => setOrders(orders));
  }, []);
  React.useEffect(() => {
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => getUnservedOrders().then((orders) => setOrders(orders))
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      className=" bg-white dark:bg-zinc-800"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
    >
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      <FlashList
        renderItem={({ item: order }) => <GuestOrderCard order={order} />}
        data={orders}
        estimatedItemSize={200}
        contentContainerStyle={{ padding: 16 }}
        horizontal={false}
        ListEmptyComponent={
          <SafeAreaView className="flex flex-col gap-4 items-center justify-center mt-20">
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/17768/17768780.png",
              }}
              style={{ width: 100, height: 100, opacity: 0.5 }}
            />
            <Text style={{ color: "gray" }}>No hay items para mostrar</Text>
          </SafeAreaView>
        }
      />
    </ScrollView>
  );
}
