import { router, Stack } from "expo-router";
import React from "react";
import { Button } from "react-native";

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
            headerRight: () => (
              <Button
                title="Cancelar"
                color="#FF6247"
                onPress={() => router.back()}
              />
            ),
          };
        }}
      />
    </Stack>
  );
}
