import { ORDEE_THEME } from "@/constants/ordee";
import { AuthContextProvider } from "@/context";
import { DARK_NAV_THEME, NAV_THEME } from "@/utils";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { Toaster } from "sonner-native";
import "../styles/global.css";

export { ErrorBoundary } from "expo-router";

const customLightTheme = { ...MD3LightTheme, colors: ORDEE_THEME.light };
const customDarkTheme = { ...MD3DarkTheme, colors: ORDEE_THEME.dark };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

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
            <Slot />
          </PaperProvider>
          <Toaster />
        </ThemeProvider>
      </GestureHandlerRootView>
    </AuthContextProvider>
  );
}
