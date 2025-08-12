
import { Stack } from "expo-router";
export default function Layout() {
  return (
    <Stack
      screenOptions={{
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/add-order"
        options={{
          title: "Agregar Orden",
          presentation: "card",
          headerShown: false,
        }}
      />
    </Stack>

  );
}
