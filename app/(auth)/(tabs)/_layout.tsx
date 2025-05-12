import Colors from "@/constants/Colors";
import { useAuth } from "@/context";
import { useColorScheme } from "@/utils/expo/useColorScheme";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StatusBar, StyleSheet, Text } from "react-native";
import { OrdeeTabs } from "@/constants/tabs";
import BlurView from "@/components/blur-view";


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { profile } = useAuth();

  const tabIcon = (focusedIcon: string, unfocusedIcon: string) => {
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

  return (
    <Tabs
      screenOptions={{
        animation: "shift",
        headerShown: false,
        lazy: true,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: {
          position: "absolute",
          backgroundColor:
            colorScheme === "dark"
              ? "black"
              : Platform.select({
                ios: "transparent",
                android: "rgba(255, 255, 255, 1)",
              }),
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "rgba(0,0,0,0.2)",
          elevation: 0,
        },
        headerStyle: {
          height: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
        tabBarHideOnKeyboard: true,
        freezeOnBlur: true,
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              tint={
                colorScheme === "dark" ? "dark" : "systemThickMaterialLight"
              }
              intensity={80}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      }}
    >
      {OrdeeTabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            headerShown: tab.name === "my-profile",
            // TODO: Add role check
            // href: tab.roles.includes(profile?.role)
            //   ? undefined
            //   : null,
            tabBarIcon: tabIcon(
              `https://api.iconify.design/${tab.icon[0]}`,
              `https://api.iconify.design/${tab.icon[1]}`
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                className={` text-xs   ${focused
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
