import { OrderCardSkeleton, PaymentCard } from "@/components";
import { useOrderContext } from "@/context";
import { supabase } from "@/utils";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { View, ScrollView } from "react-native";
import { Appbar, Divider, Searchbar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";
import { IOrder } from "@/interfaces";

const getDateString = (date: Date | undefined): string => {
  if (!date) {
    return getDateString(new Date());
  }
  return date.toISOString().split('T')[0];
};

interface GroupedOrder {
  date: string;
  orders: IOrder[];
}

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

  const groupedOrders = React.useMemo(() => {
    const filtered = paidOrders.filter((order) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return order.tables?.number.toString().toLowerCase().includes(query);
      }
      return true;
    });

    const groups = filtered.reduce((acc: { [key: string]: any[] }, order) => {
      const dateStr = getDateString(order.date ? new Date(order.date) : undefined);
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
            Fecha: {getDateString(new Date(group.date))}
          </Text>
        </View>
      </View>
      <View>
        {group.orders.map((order, index) => (
          <React.Fragment key={order.id}>
            <View className="">
              <PaymentCard order={order} />
            </View>
            {index < group.orders.length - 1 && (
              <Divider className="" />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100, justifyContent: "space-between" }}
    >
      <View className="flex-1">
        <Appbar.Header className="border-b">
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
              placeholder="Ingresa el número de mesa..."
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
    </ScrollView>
  );
}