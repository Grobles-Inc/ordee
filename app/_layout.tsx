import { ORDEE_THEME } from "@/constants/ordee";
import { AuthContextProvider, OrderContextProvider } from "@/context";
import { CategoryContextProvider } from "@/context/category";
import { CustomerContextProvider } from "@/context/customer";
import { MealContextProvider } from "@/context/meals";
import { DARK_NAV_THEME, NAV_THEME } from "@/utils/constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
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

const customLightTheme = { ...MD3LightTheme, colors: ORDEE_THEME.light };
const customDarkTheme = { ...MD3DarkTheme, colors: ORDEE_THEME.dark };

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
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const paperTheme = isDarkMode ? customDarkTheme : customLightTheme;

  return (
    <AuthContextProvider>
      <GestureHandlerRootView>
        <ThemeProvider
          value={{
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              ...NAV_THEME,
              ...(isDarkMode ? DARK_NAV_THEME : {}),
            },
            dark: isDarkMode,
          }}
        >
          <PaperProvider theme={paperTheme}>
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
