import {
  CategoryContextProvider,
  CustomerContextProvider,
  MealContextProvider,
  OrderContextProvider,
} from "@/context";
import { Stack } from "expo-router";
export default function Layout() {
  return (
    <OrderContextProvider>
      <CategoryContextProvider>
        <MealContextProvider>
          <CustomerContextProvider>
            <Stack>
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
          </CustomerContextProvider>
        </MealContextProvider>
      </CategoryContextProvider>
    </OrderContextProvider>
  );
}
