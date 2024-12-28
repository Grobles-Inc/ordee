import { useAuth } from "@/context";
import React, { useState } from "react";
import { View, Image, ScrollView } from "react-native";
import { Button, RadioButton, Text } from "react-native-paper";

type AppearanceOption = "light" | "dark" | "system";

export default function SettingsScreen() {
  const [appearance, setAppearance] = useState<AppearanceOption>("light");
  const { signOut } = useAuth();

  return (
    <ScrollView
      className="flex-1 p-4 bg-white dark:bg-zinc-900"
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
            status={appearance === "light" ? "checked" : "unchecked"}
            onPress={() => setAppearance("light")}
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
            status={appearance === "dark" ? "checked" : "unchecked"}
            onPress={() => setAppearance("dark")}
            color="#007AFF"
          />
          <Text className=" capitalize">Oscuro</Text>
        </View>
      </View>

      <Text variant="bodyMedium" style={{ color: "gray" }} className=" mb-4">
        Selecciona tu modo de visualización y cambia el tema de la aplicación. O
        si deseas accede a la configuración desde la barra de menú en la esquina
        superior derecha.
      </Text>
      <Button mode="outlined" onPress={signOut}>
        Cerrar Sesión
      </Button>
    </ScrollView>
  );
}
