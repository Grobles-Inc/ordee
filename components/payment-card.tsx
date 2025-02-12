import { IOrder } from "@/interfaces";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { List, Text } from "react-native-paper";

export function PaymentCard({ order }: { order: IOrder }) {
  const formattedDate = new Date(order.date ?? new Date()).toLocaleString(
    "es-ES",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
  return (
    <List.Item
      onPress={() => {
        router.push(`/(auth)/(tabs)/payments/receipt/${order.id}`);
      }}
      title={"Mesa " + order.tables?.number}
      description={formattedDate}
      left={(props) => (
        <View className="bg-green-100 rounded-full p-2 ml-4 flex justify-center items-center ">
          <List.Icon icon="alpha-s-circle" color="#00e680" />
        </View>
      )}
      right={(props) => (
        <View className="flex flex-row items-center  gap-4">
          <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
            S/. {order.total.toFixed(2)}
          </Text>
          <FontAwesome6 name="chevron-right" size={16} color="#a1a1aa" />
        </View>
      )}
    />
  );
}
