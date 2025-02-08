import { useAuth, useOrderContext } from "@/context";
import { supabase } from "@/utils";
import { FontAwesome5 } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
} from "react-native";
import { Badge, Button, Divider, ProgressBar, Text } from "react-native-paper";
export default function ProfileScreen() {
  const { profile, session, signOut } = useAuth();
  const [count, setCount] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [expoPushToken, setExpoPushToken] = React.useState("");
  const { getOrdersCountByDay } = useOrderContext();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const colorScheme = useColorScheme();

  async function onRefresh() {
    setRefreshing(true);
    await getOrdersCountByDay();
    setRefreshing(false);
  }
  React.useEffect(() => {
    getOrdersCountByDay().then((count) => setCount(count as number));
    supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "meals",
        },
        (payload) => {
          getOrdersCountByDay().then((count) => setCount(count as number));
        }
      )
      .subscribe();
  }, [count]);

  useFocusEffect(
    React.useCallback(() => {
      getOrdersCountByDay().then((count) => setCount(count as number));
    }, [])
  );

  const value = count / 50;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      className="bg-white dark:bg-zinc-900 "
      contentContainerStyle={{ padding: 16 }}
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
                Total Ordenes Diarias
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
                  router.push("/(auth)/(tabs)/profile/membership")
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
        <Text style={{ color: "gray" }} className="px-6 py-2 uppercase">
          MENU DE Navegación
        </Text>
        <View className="flex flex-col gap-1 w-full items-start bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4">
          <Button
            icon="account-group-outline"
            onPress={() => router.push("/(auth)/(tabs)/profile/users")}
            mode="text"
          >
            Usuarios
          </Button>
          <Divider />
          <Button
            icon="badge-account-outline"
            onPress={() => router.push("/(auth)/(tabs)/profile/membership")}
            mode="text"
          >
            Membresía
          </Button>
          <Divider />
          <Button
            icon="book-open-page-variant-outline"
            onPress={() => router.push("/(auth)/(tabs)/profile/categories")}
            mode="text"
          >
            Categorías
          </Button>
          <Divider />
          {/* <Button
          icon="account-heart-outline"
          onPress={() => router.push("/(auth)/(tabs)/profile/customers")}
          mode="text"
        >
          Clientes Fijos
        </Button> */}
          <Button
            onPress={() => router.push("/(auth)/(tabs)/profile/daily-report")}
            mode="text"
            icon="chart-line"
          >
            Reporte Diario
          </Button>
          <Divider />
          {Platform.OS === "web" && (
            <Button icon="logout" onPress={signOut}>
              Cerrar Sesión
            </Button>
          )}
          {Platform.OS !== "web" && (
            <Button
              onPress={() => router.push("/(auth)/(tabs)/profile/settings")}
              mode="text"
              icon="nut"
            >
              Configuración
            </Button>
          )}
        </View>
      </View>

      <Text className="text-muted-foreground opacity-40  mt-36 mx-auto ">
        {profile.id}
      </Text>
      <Text className="text-muted-foreground opacity-40   mx-auto text-sm">
        Versión 1.0.1
      </Text>

      <View className="absolute bottom-[150px] right-[-150px] w-[200px] h-[300px] rounded-xl rotate-[-45deg] bg-orange-300 shadow-lg" />

      <View className="absolute bottom-[75px] right-[-150px] w-[200px] h-[300px] rounded-xl rotate-[-50deg] bg-orange-400 shadow-lg" />

      <View className="absolute bottom-[0px] right-[-150px] w-[200px] h-[300px] rounded-xl rotate-[-60deg] bg-orange-500 shadow-lg" />
    </ScrollView>
  );
}
