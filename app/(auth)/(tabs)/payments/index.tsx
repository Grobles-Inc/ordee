import { OrderCardSkeleton, PaymentCard } from "@/components";
import { useOrderContext } from "@/context";
import { supabase } from "@/utils";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { Appbar, Searchbar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function PaidOrdersScreen() {
  const { paidOrders, getPaidOrders, loading } = useOrderContext();
  const [search, setSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
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
  const filteredOrders = paidOrders.filter((order) => {
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
          titleStyle={{ fontWeight: "bold" }}
          title="Pedidos Pagados"
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
            placeholder="Buscar mesa..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            mode="bar"
          />
        </Animated.View>
      )}
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
          renderItem={({ item: order }) => <PaymentCard order={order} />}
          data={filteredOrders}
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
    </View>
  );
}
