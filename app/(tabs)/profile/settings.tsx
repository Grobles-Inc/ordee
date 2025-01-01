import { useAuth } from "@/context";
import React from "react";
import { Image, ScrollView, useColorScheme, View } from "react-native";
import { Button, RadioButton, Text } from "react-native-paper";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const { signOut } = useAuth();

  return (
    <ScrollView
      className=" p-4 bg-white dark:bg-zinc-900"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="flex-row justify-between mb-8">
        <View className="items-center">
          <Image
            source={require("../../../assets/images/light.png")}
            className="w-48 h-72 rounded-lg mb-2"
          />
          <RadioButton.Android
            value="light"
            status={colorScheme === "light" ? "checked" : "unchecked"}
            onPress={() => colorScheme === "light"}
            color="#007AFF"
          />
          <Text className=" capitalize">Claro</Text>
        </View>
        <View className="items-center">
          <Image
            source={require("../../../assets/images/dark.png")}
            className="w-48 h-72 rounded-lg mb-2"
          />
          <RadioButton.Android
            value="dark"
            status={colorScheme === "dark" ? "checked" : "unchecked"}
            onPress={() => colorScheme === "dark"}
            color="#007AFF"
          />
          <Text className=" capitalize">Oscuro</Text>
        </View>
      </View>

      <Text variant="bodyMedium" style={{ color: "gray" }}>
        Selecciona tu modo de visualización y cambia el tema de la aplicación. O
        si deseas accede a la configuración desde la barra de menú en la esquina
        superior derecha.
      </Text>
      <Button mode="contained" onPress={signOut} style={{ marginTop: 40 }}>
        Cerrar Sesión
      </Button>
    </ScrollView>
  );
}
