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
          headerLargeTitleShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="add-meal"
        options={{
          title: "Item",
          presentation: "card",
          headerBackTitle: "Menú",
        }}
      />
    </Stack>
  );
}
