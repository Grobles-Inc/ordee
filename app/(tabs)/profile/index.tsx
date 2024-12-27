import { useAuth } from "@/context";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Text } from "react-native-paper";
export default function ProfileScreen() {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const getRoleLabel = (role: string) => {
    const roles = {
      waiter: "Mesero",
      chef: "Cocinero",
      admin: "Administrador",
    };
    return roles[role as keyof typeof roles] || role;
  };

  return (
    <ScrollView className="bg-white p-4 dark:bg-zinc-900">
      <View className="flex flex-col items-center justify-center mb-10">
        <Image
          source={{
            uri: profile.tenants?.logo,
          }}
          style={{
            width: 100,
            height: 100,
          }}
        />
      </View>

      <View className="flex flex-row gap-4 items-center">
        <Image
          accessibilityLabel="tenant-logo"
          style={{
            width: 50,
            height: 50,
          }}
          source={{
            uri: profile.image_url,
          }}
        />

        <View className="flex flex-col">
          <Text variant="titleLarge">
            {profile.name} {profile.last_name}
          </Text>
          <Text variant="labelMedium" style={{ color: "gray" }}>
            {getRoleLabel(profile.role)}
          </Text>
        </View>
      </View>
      <View className="flex flex-col gap-2 mt-10 items-start ">
        <Button
          icon="account-group-outline"
          onPress={() => router.push("/(tabs)/profile/users")}
          mode="text"
        >
          Usuarios
        </Button>
        <Button
          icon="badge-account-outline"
          onPress={() => router.push("/(tabs)/profile/membership")}
          mode="text"
        >
          Membresía
        </Button>
        <Button
          icon="book-open-page-variant-outline"
          onPress={() => router.push("/(tabs)/profile/categories")}
          mode="text"
        >
          Categorías
        </Button>
        <Button
          icon="account-heart-outline"
          onPress={() => router.push("/(tabs)/profile/customers")}
          mode="text"
        >
          Clientes Fijos
        </Button>
        <Button
          onPress={() => router.push("/(tabs)/profile/daily-report")}
          mode="text"
          icon="chart-line"
        >
          Reporte Diario
        </Button>
        <Button onPress={signOut} icon="logout" mode="text">
          Cerrar Sesión
        </Button>
      </View>

      <Text className="text-muted-foreground opacity-40  mt-28 mx-auto ">
        {profile.id}
      </Text>
      <Text className="text-muted-foreground opacity-40   mx-auto text-sm">
        Versión 0.9.21
      </Text>

      <View className="absolute bottom-[150px] right-[-150px] w-[200px] h-[300px] rounded-xl rotate-[-45deg] bg-yellow-400 shadow-lg" />

      <View className="absolute bottom-[75px] right-[-150px] w-[200px] h-[300px] rounded-xl rotate-[-50deg] bg-white shadow-lg" />

      <View className="absolute bottom-[0px] right-[-150px] w-[200px] h-[300px] rounded-xl rotate-[-60deg] bg-orange-600 shadow-lg" />
    </ScrollView>
  );
}
