import { FontAwesome6 } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import {
  TouchableOpacity,
  useColorScheme
} from "react-native";

export default function MenuLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
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
          title: "Formulario de Item",
          presentation: "modal",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome6
                name="xmark"
                size={20}
                color={isDarkMode ? "white" : "black"}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
