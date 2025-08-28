import Colors from "@/constants/Colors";
import { OrdeeTabs } from "@/constants/tabs";
import { useAuth } from "@/context/auth";
import { useColorScheme } from "@/utils/expo/useColorScheme";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator, Platform, StatusBar, StyleSheet, Text, View } from "react-native";


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { profile, loading } = useAuth();

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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colorScheme === "dark" ? "#000000" : "#ffffff" }}>
        <ActivityIndicator size="large" color={colorScheme === "dark" ? "#ffffff" : "#000000"} />
      </View>
    );
  }
  return (
    <Tabs
      screenOptions={{
        animation: "shift",
        headerShown: false,
        lazy: true,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: colorScheme === "dark" ? "#000000" : "#ffffff",
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "rgba(0,0,0,0.2)",
          elevation: 0,
        },
        headerStyle: {
          height: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
        tabBarHideOnKeyboard: true,
        freezeOnBlur: true,

      }}
    >
      {OrdeeTabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            headerShown: tab.name === "my-profile",
            href: (profile && profile.role && !tab.roles.includes(profile.role))
              ? null
              : undefined,
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
