import { IOrder } from "@/interfaces";
import { router } from "expo-router";
import React from "react";
import { Avatar, Card, IconButton } from "react-native-paper";

export default function OrderCard({ order }: { order: IOrder }) {
  return (
    <Card
      style={{
        marginHorizontal: 10,
        marginVertical: 8,
      }}
      onPress={() => {
        router.push(`/(tabs)/chef-order/details/${order.id}`);
      }}
    >
      <Card.Title
        title={"Mesa #" + order.table}
        subtitle={"Status" + order.served}
        left={(props) => <Avatar.Icon {...props} icon="food" />}
        right={(props) => <IconButton {...props} icon="chevron-right" />}
      />
    </Card>
  );
}
