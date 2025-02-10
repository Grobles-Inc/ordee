import { IOrder } from "@/interfaces";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Chip, List, Text } from "react-native-paper";
export function OrderCard({ order }: { order: IOrder }) {
  const formattedDate = new Date(order.date ?? new Date()).toLocaleString(
    "es-ES",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
  return (
    <List.Item
      onPress={() => {
        router.push({
          pathname: "/(auth)/(tabs)/orders/details/[id]",
          params: { id: order.id as string },
        });
      }}
      title={"Mesa " + order.tables?.number}
      description={order.served ? null : "En espera"}
      left={(props) => <List.Icon {...props} icon="food" color="#FF6247" />}
      right={(props) => (
        <View className="flex flex-row items-center gap-4 ">
          <Text
            variant="bodyMedium"
            style={{ fontWeight: "bold", textTransform: "uppercase" }}
          >
            {formattedDate}
          </Text>
          <FontAwesome6 name="chevron-right" size={16} color="#a1a1aa" />
        </View>
      )}
    />
  );
}
