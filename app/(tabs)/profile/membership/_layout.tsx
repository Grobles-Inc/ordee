import { Stack } from "expo-router";
import React from "react";

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Membresía",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="paywall"
        options={() => {
          return {
            title: "Agregar Usuario",
            presentation: "fullScreenModal",
            headerShown: false,
            headerShadowVisible: false,
          };
        }}
      />
    </Stack>
  );
}
