import OrderCard from "@/components/payment-card";
import { useOrderContext } from "@/context";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { Appbar, Text } from "react-native-paper";

export default function PaidOrdersScreen() {
  const { paidOrders, getPaidOrders, loading } = useOrderContext();
  async function onRefresh() {
    await getPaidOrders();
  }
  React.useEffect(() => {
    getPaidOrders();
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
            <View className="flex flex-col gap-4 items-center justify-center ">
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
      </View>
    </>
  );
}
