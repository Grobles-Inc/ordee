import { useOrderContext } from "@/context";
import { router, Stack } from "expo-router";
import React from "react";
import { Button as NativeButton } from "react-native";
import { Platform } from "react-native";
import { Button } from "react-native-paper";

export default function UserLayout() {
  const { order, setUpdatingOrder } = useOrderContext();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Pedidos",
          headerShown: false,
          headerLargeTitleShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          title: "Mesa " + order.tables?.number,
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerRight: () => {
            //FEATURE: For convention now this is a global free feature
            if (order.paid) {
              return null;
            }
            return Platform.OS === "ios" ? (
              <NativeButton
                title="Editar"
                color="#FF6247"
                onPress={() => {
                  router.push({
                    pathname: "/add-order",
                    params: {
                      number: order.tables?.number,
                      id_order: order.id,
                    },
                  });
                  setUpdatingOrder(order);
                }}
              />
            ) : (
              <Button
                mode="text"
                onPress={() => {
                  router.push({
                    pathname: "/add-order",
                    params: {
                      number: order.tables?.number,
                      id_order: order.id,
                    },
                  });
                  setUpdatingOrder(order);
                }}
              >
                Editar
              </Button>
            );
          },
        }}
      />
    </Stack>
  );
}
