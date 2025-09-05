import { PaymentCard } from "@/components";
import { useAuth } from "@/context/auth";
import { useOrderStore } from "@/context/order";
import { IOrder } from "@/interfaces";
import { formatOrderDate } from "@/utils/dateFormatter";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { ActivityIndicator, Appbar, Divider, Searchbar, Text } from "react-native-paper";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface GroupedOrder {
  date: string;
  orders: IOrder[];
}

export default function PaidOrdersScreen() {
  const { paidOrders, getPaidOrders, subscribeToOrders } = useOrderStore();
  const { profile } = useAuth();
  const [search, setSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  async function onRefresh() {
    if (!profile.id_tenant) return;
    await getPaidOrders(profile.id_tenant);
  }

  React.useEffect(() => {
    if (!profile.id_tenant) return;

    // Load paid orders initially
    setLoading(true);
    getPaidOrders(profile.id_tenant);
    setLoading(false);

    // Subscribe to real-time updates using the store's subscription method
    const unsubscribe = subscribeToOrders(profile.id_tenant);

    return () => {
      unsubscribe();
    };
  }, [profile.id_tenant]);

  const groupedOrders = React.useMemo(() => {
    const filtered = paidOrders.filter((order) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return order.tables?.number.toString().toLowerCase().includes(query);
      }
      return true;
    });

    const groups = filtered.reduce((acc: { [key: string]: any[] }, order) => {
      const dateStr = order.date
        ? formatOrderDate(new Date(order.date))
        : "Unknown Date";
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(order);
      return acc;
    }, {});

    return Object.entries(groups)
      .map(([date, orders]) => ({ date, orders }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [paidOrders, searchQuery]);

  const renderItem = ({ item: group }: { item: GroupedOrder }) => (
    <View className="overflow-hidden">
      <View>
        <View className="py-2 px-4">
          <Text variant="bodySmall" style={{ color: "gray" }}>
            {group.date}
          </Text>
        </View>
      </View>
      <View>
        {group.orders.map((order, index) => (
          <React.Fragment key={order.id}>
            <View className="">
              <PaymentCard order={order} />
            </View>
            {index < group.orders.length - 1 && <Divider className="" />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );

  return (

    <View className="flex-1">
      <Appbar.Header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
        <Appbar.Content
          titleStyle={{ fontWeight: "bold" }}
          title="Pagados"
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
            placeholder="Ingresa el número de mesa..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            mode="bar"
          />
        </Animated.View>
      )}
      <View className="flex-1">
        {loading && (
          <ActivityIndicator size="large" className="mt-10" />
        )}
        <FlashList
          refreshing={loading}
          contentContainerStyle={{
            paddingVertical: 16,
          }}
          onRefresh={onRefresh}
          renderItem={renderItem}
          data={groupedOrders}
          estimatedItemSize={250}
          ItemSeparatorComponent={() => <View className="h-4" />}
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
