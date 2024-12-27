import { DefaultTheme, DarkTheme } from "@react-navigation/native";
export const NAV_THEME = {
  ...DefaultTheme.colors,
  primary: "#FF6247", // Example primary color
  background: "#ffffff", // Light background
  card: "#ffffff", // Light card color
  text: "#000000", // Light text color
};

export const DARK_NAV_THEME = {
  ...DarkTheme.colors,
  primary: "#FF6247", // Example primary color for dark mode
  background: "#121212", // Dark background
  card: "#18181b", // Dark card color
  text: "#ffffff", // Light text color on dark background
};
