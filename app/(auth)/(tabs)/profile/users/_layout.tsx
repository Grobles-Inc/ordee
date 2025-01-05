import { Stack } from "expo-router";
import React from "react";

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Users",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="add-user"
        options={() => {
          return {
            title: "Agregar Usuario",
            presentation: "modal",
            headerShown: false,
          };
        }}
      />
    </Stack>
  );
}
