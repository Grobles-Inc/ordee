import { Stack } from "expo-router";
import React from "react";

export default function GuestLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Pedidos",
          headerLargeTitle: true,
          headerShadowVisible: true,
          headerLargeTitleShadowVisible: false,
        }}
      />
    </Stack>
  );
}
