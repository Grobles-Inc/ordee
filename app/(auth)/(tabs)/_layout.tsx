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
        headerShown: false,
        tabBarActiveTintColor: "#FF6247",
        tabBarInactiveTintColor: "#9ca3af",
      }}
    >
      {OrdeeTabs.map((tab) => {
        const hasAccess = (profile && profile.role && !tab.roles.includes(profile.role));

        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              href: hasAccess
                ? null
                : undefined,
              tabBarIcon: ({ focused, color }) => (
                <Image
                  source={{ uri: focused ? `https://api.iconify.design/${tab.icon[0]}` : `https://api.iconify.design/${tab.icon[1]}` }}
                  style={{ width: 24, height: 24, tintColor: color }}
                />
              ),
              tabBarLabel: ({ focused, color }) => (
                <Text style={{ fontSize: 12, color }}>
                  {tab.title}
                </Text>
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
