import { ORDEE_THEME } from "@/constants/ordee";
import { AuthContextProvider } from "@/context/auth";
import { DARK_NAV_THEME, NAV_THEME } from "@/utils";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import {
  ActivityIndicator,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import "react-native-reanimated";
import { Toaster } from "sonner-native";
import "../styles/global.css";

export { ErrorBoundary } from "expo-router";

const customLightTheme = { ...MD3LightTheme, colors: ORDEE_THEME.light };
const customDarkTheme = { ...MD3DarkTheme, colors: ORDEE_THEME.dark };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    const checkOnboardingAndAuth = async () => {
      const onboardingCompleted = await AsyncStorage.getItem(
        "onboardingCompleted"
      );
      setIsLoading(false);
    };

    checkOnboardingAndAuth();
  }, []);
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
  if (isLoading) {
    return <ActivityIndicator />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const paperTheme = isDarkMode ? customDarkTheme : customLightTheme;

  return (
    <AuthContextProvider>
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
        <Toaster className="web:md:w-1/3 web:md:left-1/3" />
      </ThemeProvider>
    </AuthContextProvider>
  );
}
