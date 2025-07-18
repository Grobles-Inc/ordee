import {
  CategoryContextProvider,

  MealContextProvider,
  OrderContextProvider,
} from "@/context";
import { Stack } from "expo-router";
export default function Layout() {
  return (
    <OrderContextProvider>
      <CategoryContextProvider>
        <MealContextProvider>

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

        </MealContextProvider>
      </CategoryContextProvider>
    </OrderContextProvider>
  );
}
