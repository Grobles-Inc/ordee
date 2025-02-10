// layout.web.tsx
import { OrdeeTabs } from "@/constants/tabs";
import { useAuth } from "@/context"; // Import your authentication context
import { useColorScheme } from "@/utils/expo/useColorScheme.web";
import { Image } from "expo-image";
import { Stack, useRouter, useSegments } from "expo-router";
import React from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";

function SidebarItem({
  icon,
  title,
  unfocusedIcon,
  href,
  isActive,
  compact = false,
}: {
  icon: string;
  unfocusedIcon: string;
  title: string;
  isActive: boolean;
  href: string;
  compact?: boolean;
}) {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const hoverBg =
    colorScheme === "dark"
      ? "rgba(255, 59, 48, 0.1)"
      : "rgba(255, 59, 48, 0.1)";

  const iconColor = isActive ? "#FF6247" : "#8E8E8F";
  const size = compact ? 28 : 24;
  const tabIcon = (focused: boolean) => {
    return (
      <Image
        style={{ width: size, height: size, tintColor: iconColor }}
        source={{
          uri: focused ? icon : unfocusedIcon,
        }}
        alt="icon"
      />
    );
  };

  return (
    <Pressable
      onPress={() => {
        window?.scrollTo({ top: 0, behavior: "smooth" });
        router.push(href as any);
        isActive;
      }}
      className={`flex flex-row items-center p-2 rounded-lg gap-3 mb-0.5
        hover:bg-gray-200 transition-all duration-200  ${
          compact ? "justify-center w-10 h-10 mx-auto" : "pl-2 pr-6 mr-8"
        } ${isActive ? "bg-[#e6e6e7]" : ""}`}
      style={({ pressed, hovered }) => [
        (pressed || hovered) && { backgroundColor: hoverBg },
      ]}
    >
      {tabIcon(isActive)}
      {!compact && (
        <Text
          className={`text-[15px] font-semibold ${isActive ? "font-bold" : ""}`}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

export default function WebLayout() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const segments = useSegments();
  const { profile } = useAuth();

  const borderColor = colorScheme === "dark" ? "#2f3336" : "#eee";
  const isCompact = width < 1024;
  const isMobile = width < 768;

  const filteredTabs = OrdeeTabs.filter((tab) =>
    tab.roles.includes(profile?.role as string)
  );

  return (
    <View className="flex-row left-0 right-0 bg-white justify-center relative">
      {!isMobile && (
        <View
          className={`${
            isCompact ? "w-[72px]" : ""
          } items-end sticky top-0 h-screen border-r border-gray-500`}
          style={{ borderRightColor: borderColor }}
        >
          <View
            className={`sticky ${
              isCompact ? "w-[72px] p-2" : "w-[275px] p-2"
            } h-full`}
          >
            <View className="mb-8 pl-3 pt-3">
              <Image
                style={{
                  width: 125,
                  height: 125,
                }}
                source={require("../../../assets/images/logo.png")}
              />
            </View>

            <View className="">
              {filteredTabs.map((tab) => (
                <SidebarItem
                  key={tab.name}
                  icon={`https://api.iconify.design/${tab.icon[0]}`}
                  unfocusedIcon={`https://api.iconify.design/${tab.icon[1]}`}
                  title={tab.title}
                  href={tab.name}
                  compact={isCompact}
                  isActive={
                    segments.length === 2 &&
                    segments[1] === tab.name.split("/").pop()
                  }
                />
              ))}
            </View>
          </View>
        </View>
      )}

      <View className="flex-1 w-full max-w-[611px] bg-transparent">
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>
    </View>
  );
}
