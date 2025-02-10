import { OrdeeTabs } from "@/constants/tabs";
import { useAuth } from "@/context";
import { useColorScheme } from "@/utils/expo/useColorScheme.web";
import { Image } from "expo-image";
import { router, Stack, useSegments } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

function SidebarItem({
  icon,
  title,
  unfocusedIcon,
  isActive,
  href,
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
  const hoverBg =
    colorScheme === "dark"
      ? "rgba(255, 59, 48, 0.1)"
      : "rgba(255, 59, 48, 0.1)";
  const size = compact ? 28 : 24;

  return (
    <Pressable
      onPress={() => {
        window?.scrollTo({ top: 0, behavior: "smooth" });
        router.push(href as any);
      }}
      className={`flex flex-row items-center p-2 rounded-lg gap-3 mb-0.5
        hover:dark:bg-zinc-700 hover:bg-zinc-100 transition-all duration-200  ${
          compact ? "justify-center w-10 h-10 mx-auto" : "pl-2 pr-6 mr-8"
        } ${isActive ? "bg-zinc-200 dark:bg-zinc-600" : ""}`}
      style={({ pressed, hovered }) => [
        (pressed || hovered) && { backgroundColor: hoverBg },
      ]}
    >
      <Image
        style={{
          width: size,
          height: size,
        }}
        source={{
          uri: isActive ? icon : unfocusedIcon,
        }}
        alt="icon"
      />
      {!compact && (
        <Text
          className={`text-lg  font-semibold ${
            isActive
              ? "font-bold dark:text-white text-black"
              : "text-black  dark:text-white"
          }`}
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
  const [isActive, setIsActive] = React.useState(false);
  const iconColor = isActive
    ? "#FF6247"
    : colorScheme === "dark"
    ? "#ffffff"
    : "#8E8E8F";
  const isCompact = width < 1024;
  const isMobile = width < 768;
  const borderColor = colorScheme === "dark" ? "#2f3336" : "#eee";

  const filteredTabs = OrdeeTabs.filter((tab) =>
    tab.roles.includes(profile?.role as string)
  );

  const tabIcon = (
    focusedIcon: string,
    unfocusedIcon: string,
    focused: boolean
  ) => {
    return (
      <Image
        style={{ width: 28, height: 28, tintColor: iconColor }}
        source={{
          uri: focused ? focusedIcon : unfocusedIcon,
        }}
        alt="icon"
      />
    );
  };

  return (
    <>
      {isMobile && (
        <View className="flex-1 web:md:flex-none">
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </View>
      )}

      <View className="flex-row left-0 right-0 bg-white dark:bg-zinc-800 justify-center relative">
        {!isMobile && (
          <View
            className={`${
              isCompact ? "w-[72px]" : ""
            } items-end sticky top-0 h-screen border-r `}
            style={{
              borderRightColor: borderColor,
            }}
          >
            <View
              className={`sticky ${
                isCompact ? "w-[72px] p-2" : "w-[275px] p-2"
              } h-full`}
            >
              <View className="mb-8  pt-3 flex flex-row items-center gap-2 ">
                <Image
                  style={{
                    width: 100,
                    height: 100,
                  }}
                  source={require("../../../assets/images/logo.png")}
                />
                <Text className="text-4xl text-[#FF6247] font-bold">Ordee</Text>
              </View>

              <View className="flex flex-col gap-4">
                {filteredTabs.map((tab) => (
                  <SidebarItem
                    key={tab.name}
                    icon={`https://api.iconify.design/${tab.icon[0]}`}
                    unfocusedIcon={`https://api.iconify.design/${tab.icon[1]}`}
                    title={tab.title}
                    href={tab.name}
                    compact={isCompact}
                    isActive={segments.includes(tab.name as never)}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
        {!isMobile && (
          <View className="flex-1 w-full max-w-[611px] bg-transparent">
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </View>
        )}

        {isMobile && (
          <View
            className={`fixed bottom-0 left-0 right-0 h-16 flex-row border-t ${
              Platform.OS === "ios" ? "pb-5" : ""
            }`}
            style={{
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(10, 10,10, 0.7)"
                  : "rgba(255, 255, 255, 0.5)",
              backdropFilter: Platform.OS === "web" ? "blur(12px)" : undefined,
              borderTopColor: borderColor,
            }}
          >
            {filteredTabs.map((tab) => (
              <Pressable
                key={tab.name}
                onPress={() => {
                  router.push(`/(auth)/(tabs)/${tab.name}` as never);
                }}
                className="flex-1 items-center justify-center gap-1"
              >
                {tabIcon(
                  `https://api.iconify.design/${tab.icon[0]}`,
                  `https://api.iconify.design/${tab.icon[1]}`,
                  segments.includes(tab.name as never)
                )}
                <Text
                  className="text-xs font-medium"
                  style={{
                    color: segments.includes(tab.name as never)
                      ? "#FA2E47"
                      : colorScheme === "dark"
                      ? "#999"
                      : "#666",
                  }}
                >
                  {tab.title}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </>
  );
}
