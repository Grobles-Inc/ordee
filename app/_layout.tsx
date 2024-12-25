import { AuthContextProvider, OrderContextProvider } from "@/context";
import { CategoryContextProvider } from "@/context/category";
import { CustomerContextProvider } from "@/context/customer";
import { MealContextProvider } from "@/context/meals";
import { NAV_THEME } from "@/utils/constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DefaultTheme as DefaultNavigationTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import "react-native-reanimated";
import { Toaster } from "sonner-native";
import "../styles/global.css";
// Import your global CSS file

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomato",
    secondary: "yellow",
  },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <AuthContextProvider>
      <GestureHandlerRootView>
        <ThemeProvider
          value={{
            ...DefaultNavigationTheme,
            colors: NAV_THEME,
          }}
        >
          <PaperProvider theme={theme}>
            <OrderContextProvider>
              <CategoryContextProvider>
                <MealContextProvider>
                  <CustomerContextProvider>
                    <Stack>
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="(auth)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="add-order"
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
          </PaperProvider>
          <Toaster />
        </ThemeProvider>
      </GestureHandlerRootView>
    </AuthContextProvider>
  );
}
