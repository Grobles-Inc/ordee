import OrderCard from "@/components/chef-order-card";
import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export default function HomeScreen() {
  const [orders, setOrders] = React.useState<IOrder[]>();
  const { getUnservedOrders, loading } = useOrderContext();
  React.useEffect(() => {
    getUnservedOrders().then((orders) => setOrders(orders));
  }, []);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      className="p-4"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
    >
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      <FlashList
        renderItem={({ item: order }) => <OrderCard order={order} />}
        data={orders}
        estimatedItemSize={200}
        horizontal={false}
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
      />
    </ScrollView>
  );
}
