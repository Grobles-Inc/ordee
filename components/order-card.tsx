import { IOrder } from "@/interfaces";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Avatar, Card, Chip, Text } from "react-native-paper";
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
    <Card
      style={{
        marginVertical: 8,
        shadowOpacity: 0,
      }}
      onPress={() => {
        router.push({
          pathname: "/(auth)/(tabs)/orders/details/[id]",
          params: { id: order.id as string },
        });
      }}
    >
      <Card.Title
        title={"Mesa " + order.tables?.number}
        subtitle={order.served ? null : "En espera"}
        subtitleStyle={{ color: "gray" }}
        left={(props) => (
          <Avatar.Icon color="white" {...props} icon="food-fork-drink" />
        )}
        right={(props) => (
          <View className="flex flex-col gap-2">
            <View className="flex flex-row items-center gap-2 mr-4">
              <Text
                variant="bodyMedium"
                style={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                {formattedDate}
              </Text>
              <FontAwesome6 name="chevron-right" size={16} color="#a1a1aa" />
            </View>
            {order.free && (
              <Chip
                className="rounded-l-none rounded-t-none "
                style={{ backgroundColor: "#FF6247" }}
                selectedColor="white"
              >
                Pedido Gratis
              </Chip>
            )}
          </View>
        )}
      />
    </Card>
  );
}
