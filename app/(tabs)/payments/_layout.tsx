import { useOrderContext } from "@/context";
import { router, Stack } from "expo-router";
import React from "react";
export default function PaymentsLayout() {
  const { order } = useOrderContext();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Pedidos Pagados",
          headerShadowVisible: false,
          headerShown: false,
          headerLargeTitle: true,
          // headerSearchBarOptions: {
          //   placeholder: "Buscar ...",
          //   hideWhenScrolling: true,
          //   cancelButtonText: "Cancelar",
          //   onChangeText: (event) => {
          //     const search = event.nativeEvent.text;
          //     router.setParams({
          //       search: search,
          //     });
          //   },
          //   onCancelButtonPress: () => {
          //     router.setParams({
          //       search: undefined,
          //     });
          //   },
          // },
        }}
      />
      <Stack.Screen
        name="receipt/[id]"
        options={({ route }) => {
          const { id } = route.params as { id: string };
          return {
            title: "Mesa " + order.id_table,
            headerBackTitle: "Pagos",
            headerLargeTitle: true,
            headerBackVisible: true,
            headerShadowVisible: false,
            headerLargeTitleShadowVisible: false,
          };
        }}
      />
    </Stack>
  );
}
