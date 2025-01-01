import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import React from "react";
import { Alert, View } from "react-native";
import { Card, Divider, IconButton, Text } from "react-native-paper";

export function GuestOrderCard({ order }: { order: IOrder }) {
  const { updateOrderServedStatus } = useOrderContext();
  const onOrderStatusChange = (id: string) => {
    Alert.alert("Preparado", "Marcar como pedido preparado", [
      {
        text: "Sí",
        onPress: () => {
          updateOrderServedStatus(id);
        },
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };
  return (
    <Card
      style={{
        marginVertical: 8,
        shadowOpacity: 0,
      }}
    >
      <Card.Title
        title={"Mesa " + order.id_table}
        titleStyle={{ fontSize: 20, fontWeight: "bold" }}
        subtitle={order.to_go ? "Para Llevar" : "Para Comer"}
        subtitleStyle={{ color: "gray" }}
        right={() => (
          <IconButton
            mode="contained"
            containerColor="#FF6247"
            iconColor="white"
            icon="check"
            style={{ marginRight: 8 }}
            onPress={() => onOrderStatusChange(order.id ? order.id : "")}
          />
        )}
      />
      <Card.Content style={{ paddingTop: 20 }}>
        <View className="flex flex-col gap-2">
          <View className="flex flex-row justify-between">
            <Text variant="bodySmall" style={{ color: "gray" }}>
              Items
            </Text>
            <Text variant="bodySmall" style={{ color: "gray" }}>
              Porciones
            </Text>
          </View>
          <Divider />
          {order.items.map((item, index) => (
            <View key={index} className="flex flex-row justify-between">
              <Text className="w-36">{item.name}</Text>
              <Text>{item.quantity}</Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}
