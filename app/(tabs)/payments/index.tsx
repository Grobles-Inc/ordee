import OrderCard from "@/components/payment-card";
import { useOrderContext } from "@/context";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { RefreshControl } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function HomeScreen() {
  const { search } = useLocalSearchParams<{ search?: string }>();
  const { paidOrders: orders, getPaidOrders: getOrders } = useOrderContext();
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setIsLoading(true);
    try {
      await getOrders();
    } catch (error) {
      console.error("Error refreshing orders:", error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  }, [getOrders]);
  React.useEffect(() => {
    onRefresh();
  }, []);
  const filteredOrders = React.useMemo(() => {
    if (!search) return orders;
    const lowercasedSearch = search.toLowerCase();
    return orders.filter(
      (order) =>
        order.fondos.toString().includes(lowercasedSearch) ||
        order.entradas.toString().includes(lowercasedSearch)
    );
  }, [search, orders]);

  if (!orders) return <ActivityIndicator />;
  if (isLoading && !orders?.length) return <ActivityIndicator />;
  return (
    <FlashList
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item: order }) => <OrderCard order={order} />}
      data={filteredOrders}
      estimatedItemSize={200}
      horizontal={false}
    />
  );
}
