import Colors from "@/constants/Colors";
import { useAuth } from "@/context";
import { useColorScheme } from "@/utils/expo/useColorScheme";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { profile } = useAuth();
  const tabConfigurations = {
    guest: [
      {
        name: "index",
        title: "Mesas",
        icon: ["mingcute:board-fill.svg", "mingcute:board-line.svg"],
      },
      {
        name: "menu",
        title: "Menú",
        icon: ["mingcute:hamburger-fill.svg", "mingcute:hamburger-line.svg"],
      },
      {
        name: "payments",
        title: "Pagos",
        href: null,
        icon: [
          "mingcute:currency-dollar-fill.svg",
          "mingcute:currency-dollar-line.svg",
        ],
      },
      {
        name: "guest-order",
        title: "Ordenes",
        icon: ["mingcute:clipboard-fill.svg", "mingcute:clipboard-line.svg"],
      },
      {
        name: "my-profile",
        title: "Mi Perfil",
        icon: ["mingcute:user-3-fill.svg", "mingcute:user-3-line.svg"],
      },
      {
        name: "orders",
        title: "Ordenes",
        href: null,
        icon: ["mingcute:clipboard-fill.svg", "mingcute:clipboard-line.svg"],
      },
      {
        name: "profile",
        title: "Mi Perfil",
        href: null,
        icon: ["mingcute:user-3-fill.svg", "mingcute:user-3-line.svg"],
      },
    ],
    admin: [
      {
        name: "index",
        title: "Mesas",
        icon: ["mingcute:board-fill.svg", "mingcute:board-line.svg"],
      },
      {
        name: "menu",
        title: "Menú",
        icon: ["mingcute:hamburger-fill.svg", "mingcute:hamburger-line.svg"],
      },
      {
        name: "payments",
        title: "Pagos",
        icon: [
          "mingcute:currency-dollar-fill.svg",
          "mingcute:currency-dollar-line.svg",
        ],
      },
      {
        name: "guest-order",
        title: "Guest",
        href: null,
        icon: ["mingcute:clipboard-fill.svg", "mingcute:clipboard-line.svg"],
      },
      {
        name: "orders",
        title: "Ordenes",
        icon: ["mingcute:clipboard-fill.svg", "mingcute:clipboard-line.svg"],
      },
      {
        name: "my-profile",
        title: "Mi Perfil",
        href: null,
        icon: ["mingcute:user-3-fill.svg", "mingcute:user-3-line.svg"],
      },
      {
        name: "profile",
        title: "Mi Perfil",
        icon: ["mingcute:user-3-fill.svg", "mingcute:user-3-line.svg"],
      },
    ],
    user: [
      {
        name: "index",
        title: "Mesas",
        icon: ["mingcute:board-fill.svg", "mingcute:board-line.svg"],
      },
      {
        name: "orders",
        title: "Ordenes",
        icon: ["mingcute:clipboard-fill.svg", "mingcute:clipboard-line.svg"],
      },
      {
        name: "my-profile",
        title: "Mi Perfil",
        icon: ["mingcute:user-3-fill.svg", "mingcute:user-3-line.svg"],
      },
      {
        name: "menu",
        title: "Menú",
        href: null,
        icon: ["mingcute:hamburger-fill.svg", "mingcute:hamburger-line.svg"],
      },
      {
        name: "payments",
        title: "Pagos",
        href: null,
        icon: [
          "mingcute:currency-dollar-fill.svg",
          "mingcute:currency-dollar-line.svg",
        ],
      },
      {
        name: "guest-order",
        title: "Guest",
        href: null,
        icon: ["mingcute:clipboard-fill.svg", "mingcute:clipboard-line.svg"],
      },
      {
        name: "profile",
        title: "Mi Perfil",
        href: null,
        icon: ["mingcute:user-3-fill.svg", "mingcute:user-3-line.svg"],
      },
    ],
  };

  const commonScreenOptions = {
    tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
    headerShown: false,
    tabBarStyle: {
      height: 80,
      paddingTop: 10,
    },
    tabBarHideOnKeyboard: true,
    freezeOnBlur: true,
  };

  const createTabIcon = (focusedIcon: string, unfocusedIcon: string) => {
    return ({ color, focused }: { color: string; focused: boolean }) => (
      <Image
        style={{ width: 28, height: 28, tintColor: color }}
        source={{
          uri: focused ? focusedIcon : unfocusedIcon,
        }}
        alt="icon"
      />
    );
  };
  const tabs =
    tabConfigurations[profile?.role as keyof typeof tabConfigurations] || [];

  return (
    <Tabs screenOptions={commonScreenOptions}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            headerShown: tab.name === "my-profile",
            href: tab.href,
            tabBarIcon: createTabIcon(
              `https://api.iconify.design/${tab.icon[0]}`,
              `https://api.iconify.design/${tab.icon[1]}`
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                className={`web:hidden text-xs web:text-md  ${
                  focused
                    ? "text-[#FF6247]"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {tab.title}
              </Text>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
