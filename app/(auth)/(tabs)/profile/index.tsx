import { useAuth } from "@/context/auth";
import { useOrderStore } from "@/context/order";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Button, ProgressBar, Text } from "react-native-paper";
export default function ProfileScreen() {
  const { profile, session, signOut } = useAuth();
  const [count, setCount] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const { getOrdersCountByDay, subscribeToOrders } = useOrderStore();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const colorScheme = useColorScheme();

  async function onRefresh() {
    if (!profile.id_tenant) return;

    setRefreshing(true);
    try {
      const orderCount = await getOrdersCountByDay(profile.id_tenant);
      setCount(orderCount || 0);
    } catch (error) {
      console.error("Error refreshing order count:", error);
    } finally {
      setRefreshing(false);
    }
  }
  React.useEffect(() => {
    if (!profile.id_tenant) return;

    const loadOrderCount = async () => {
      try {
        const orderCount = await getOrdersCountByDay(profile.id_tenant);
        setCount(orderCount || 0);
      } catch (error) {
        console.error("Error loading order count:", error);
      }
    };

    loadOrderCount();

    // Subscribe to real-time updates using the store's subscription method
    const unsubscribe = subscribeToOrders(profile.id_tenant);

    return () => {
      unsubscribe();
    };
  }, [profile.id_tenant]);

  useFocusEffect(
    React.useCallback(() => {
      if (!profile.id_tenant) return;

      getOrdersCountByDay(profile.id_tenant).then((count) => setCount(count || 0));
    }, [profile.id_tenant])
  );

  const value = count / 50;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      className="bg-white dark:bg-zinc-900 flex-1"
      contentContainerStyle={{ padding: 16, flexGrow: 1, paddingBottom: 50 }}
      style={{ marginTop: headerHeight }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="flex flex-col gap-4 items-center justify-center web:py-4">
        <Image
          accessibilityLabel="profile_logo"
          style={{
            width: 80,
            height: 80,
            borderRadius: 100,
          }}
          source={{
            uri: profile.image_url,
          }}
        />

        <View className="flex flex-col items-center gap-4">
          <View className="flex flex-col items-center">
            <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
              {profile.name}
            </Text>
            <Text style={{ color: "gray" }}>{session?.user.email}</Text>
          </View>
          <Button
            onPress={() => router.push("/(auth)/(tabs)/profile/edit")}
            mode="contained"
          >
            Editar perfil
          </Button>
        </View>
      </View>
      <View className="flex flex-col gap-2 mt-10 items-start ">
        {profile.tenants?.plans?.name === "free" && (
          <>
            <View className="bg-zinc-100 p-4 rounded-xl dark:bg-zinc-800 w-full flex flex-col gap-4">
              <Text variant="titleSmall" style={{ color: "gray" }}>
                Ordenes de hoy
              </Text>

              <View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-700">{count}</Text>
                  <Text className="font-semibold">50</Text>
                </View>
                <ProgressBar
                  animatedValue={value}
                  style={{ height: 10, borderRadius: 5 }}
                  color={colorScheme === "dark" ? "#FF6347" : "#FF4500"}
                  className="h-2 rounded-full"
                />
              </View>
            </View>

            <LinearGradient
              colors={["#FF6347", "#FF4500"]}
              style={{ marginTop: 10, borderRadius: 10, width: "100%" }}
            >
              <TouchableOpacity
                className="flex-row flex items-center justify-between  p-4"
                onPress={() =>
                  // Linking.openURL("https://cal.com/miguel-requena/meeting-ordee")
                  router.push("/(auth)/(tabs)/profile/membership/paywall")
                }
              >
                <View className=" flex flex-col gap-4 w-4/5">
                  <Text
                    variant="titleLarge"
                    style={{ fontWeight: "bold", color: "white" }}
                  >
                    Adquirir Pro
                  </Text>
                  <Text className="opacity-80 " style={{ color: "white" }}>
                    Para poder registrar ilimitadamante órdenes y demás
                    funcionalidades premium.
                  </Text>
                </View>
                <View className="bg-white/20 rounded-full p-2 ">
                  <FontAwesome5 name="check-circle" size={32} color="white" />
                </View>
              </TouchableOpacity>
            </LinearGradient>
          </>
        )}
        <View className="my-4" />
        <View className="flex flex-col gap-6 w-full items-start  dark:bg-zinc-800 rounded-xl p-4 bg-zinc-100">
          <TouchableOpacity
            className="flex-row justify-between items-center gap-3 py-2 px-3 rounded-lg w-full"
            onPress={() => router.push("/(auth)/(tabs)/profile/users")}
            activeOpacity={0.7}
          >
            <View className="flex flex-row items-center gap-3">
              <MaterialCommunityIcons name="account-group-outline" size={22} color="#FF6347" />
              <Text className="text-lg font-medium text-zinc-900 dark:text-white">Usuarios</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#FF6347" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center gap-3 py-2 px-3 rounded-lg w-full"
            onPress={() => router.push("/(auth)/(tabs)/profile/membership")}
            activeOpacity={0.7}
          >
            <View className="flex flex-row items-center gap-3">
              <MaterialCommunityIcons name="badge-account-outline" size={22} color="#FF6347" />
              <Text className="text-lg font-medium text-zinc-900 dark:text-white">Membresía</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#FF6347" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row justify-between items-center gap-3 py-2 px-3 rounded-lg w-full"
            onPress={() => router.push("/(auth)/(tabs)/profile/categories")}
            activeOpacity={0.7}
          >
            <View className="flex flex-row items-center gap-3">
              <MaterialCommunityIcons name="book-open-page-variant-outline" size={22} color="#FF6347" />
              <Text className="text-lg font-medium text-zinc-900 dark:text-white">Categorías</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#FF6347" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row justify-between items-center gap-3 py-2 px-3 rounded-lg w-full"
            onPress={() => router.push("/(auth)/(tabs)/profile/daily-report")}
            activeOpacity={0.7}
          >
            <View className="flex flex-row items-center gap-3">
              <MaterialCommunityIcons name="chart-line" size={22} color="#FF6347" />
              <Text className="text-lg font-medium text-zinc-900 dark:text-white">Reporte Diario</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#FF6347" />
          </TouchableOpacity>
          {Platform.OS === "web" && (
            <TouchableOpacity
              className="flex-row justify-between items-center gap-3 py-2 px-3 rounded-lg w-full"
              onPress={signOut}
              activeOpacity={0.7}
            >
              <View className="flex flex-row items-center gap-3">
                <MaterialCommunityIcons name="logout" size={22} color="#FF6347" />
                <Text className="text-lg font-medium text-zinc-900 dark:text-white">Cerrar Sesión</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color="#FF6347" />
            </TouchableOpacity>
          )}
          {Platform.OS !== "web" && (
            <TouchableOpacity
              className="flex-row justify-between items-center gap-3 py-2 px-3 rounded-lg w-full"
              onPress={() => router.push("/(auth)/(tabs)/profile/settings")}
              activeOpacity={0.7}
            >
              <View className="flex flex-row items-center gap-3">
                <MaterialCommunityIcons name="nut" size={22} color="#FF6347" />
                <Text className="text-lg font-medium text-zinc-900 dark:text-white">Configuración</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color="#FF6347" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text className="text-muted-foreground opacity-40 mt-10 mx-auto ">
        {profile.id}
      </Text>
      <Text className="text-muted-foreground opacity-40 mb-3 mx-auto text-sm">
        Versión 1.0.3
      </Text>

    </ScrollView>
  );
}
