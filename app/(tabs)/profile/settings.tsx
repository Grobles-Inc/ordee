import { useAuth } from "@/context";
import React, { useState } from "react";
import { View, Image, ScrollView } from "react-native";
import { Button, RadioButton, Text } from "react-native-paper";

type AppearanceOption = "light" | "dark" | "system";

export default function SettingsScreen() {
  const [appearance, setAppearance] = useState<AppearanceOption>("system");
  const { signOut } = useAuth();

  return (
    <ScrollView
      className="flex-1 p-4 bg-white dark:bg-zinc-900"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="flex-row justify-between mb-8">
        {["light", "dark", "system"].map((mode) => (
          <View key={mode} className="items-center">
            <Image
              source={{
                uri: `https://via.placeholder.com/150?text=${mode}+mode`,
              }}
              className="w-32 h-64 rounded-lg mb-2"
            />
            <RadioButton.Android
              value={mode}
              status={appearance === mode ? "checked" : "unchecked"}
              onPress={() => setAppearance(mode as AppearanceOption)}
              color="#007AFF"
            />
            <Text className=" capitalize">
              {mode === "system"
                ? "Automático"
                : mode === "light"
                ? "Claro"
                : "Oscuro"}
            </Text>
          </View>
        ))}
      </View>

      <Text className="text-base text-gray-700 dark:text-gray-300 mb-4">
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
