import { OrderCardSkeleton, OrderCard } from "@/components";
import { useOrderContext } from "@/context";
import { supabase } from "@/utils";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { Appbar, Divider, Searchbar, Text } from "react-native-paper";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrdersScreen() {
  const { getUnpaidOrders, unpaidOrders } = useOrderContext();
  const [search, setSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  async function onRefresh() {
    getUnpaidOrders();
  }
  React.useEffect(() => {
    setLoading(true);
    getUnpaidOrders();
    setLoading(false);
  }, []);
  React.useEffect(() => {
    const subscription = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          getUnpaidOrders();
        }
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filteredOrders = unpaidOrders.filter((order) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return order.tables?.number.toString().toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <View className="flex-1">
      <Appbar.Header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
        <Appbar.Content
          titleStyle={{
            fontWeight: "bold",
          }}
          title="Pedidos Recientes"
        />
        <Appbar.Action
          icon="magnify"
          mode={search ? "contained-tonal" : undefined}
          onPress={() => setSearch((prev) => !prev)}
        />
      </Appbar.Header>
      {search && (
        <Animated.View className="m-4" entering={FadeInUp.duration(200)}>
          <Searchbar
            placeholder="Ingresa el numero de mesa ..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            mode="bar"
          />
        </Animated.View>
      )}
      <View className="flex-1">
        {loading && (
          <View className="flex flex-col gap-2 p-4">
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </View>
        )}
        <FlashList
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          renderItem={({ item: order }) => <OrderCard order={order} />}
          data={filteredOrders}
          ItemSeparatorComponent={() => <Divider className="my-2" />}
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
    </View>
  );
}
