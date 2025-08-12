import { useOrderStore } from "@/context/order";
import { router, Stack } from "expo-router";
import React from "react";
export default function PaymentsLayout() {
  const { order } = useOrderStore();
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
        options={{
          title: "Detalles del Pedido",
          headerBackTitle: "Atrás ",
        }}
      />
    </Stack>
  );
}
