import { router, Stack } from "expo-router";
import React from "react";
import { Button } from "react-native";

export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Menú del Día",
          headerShown: false,
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
          headerLargeTitleShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="add-meal"
        options={{
          title: "Agregar Item",
          headerBackTitle: "Menú",
          presentation: "modal",
          headerBackVisible: true,
          headerRight: () => (
            <Button
              title="Cancelar"
              color="#FF6247"
              onPress={() => router.back()}
            />
          ),
        }}
      />
    </Stack>
  );
}
