import { useAuth } from "@/context";
import { Image } from "expo-image";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
export default function ProfileScreen() {
  const { profile, signOut, session } = useAuth();
  const getRoleLabel = (role: string) => {
    const roles = {
      user: "Mesero",
      guest: "Cocinero",
    };
    return roles[role as keyof typeof roles] || role;
  };

  return (
    <View className="bg-white p-4 h-screen-safe dark:bg-zinc-900">
      <View className="flex flex-col items-center justify-center mb-20">
        <Image
          source={{
            uri: profile.tenants?.logo,
          }}
          style={{
            width: 100,
            height: 100,
          }}
        />
        <Text style={{ fontWeight: "bold" }} variant="titleLarge">
          {profile.tenants?.name}
        </Text>
      </View>

      <View className="flex flex-col gap-4">
        <Image
          accessibilityLabel="tenant-logo"
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
          }}
          source={{
            uri: profile.image_url,
          }}
        />
        <View className="flex flex-col gap-2">
          <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
            {profile.name} {profile.last_name}
          </Text>
          <Text style={{ color: "gray" }}>{getRoleLabel(profile.role)}</Text>
          <Text variant="titleSmall">{session?.user.email}</Text>
        </View>
      </View>
      <Button
        style={{ marginTop: 120 }}
        onPress={signOut}
        icon="logout"
        mode="contained"
      >
        Cerrar Sesión
      </Button>

      <Text className="text-muted-foreground opacity-40  mt-5 mx-auto ">
        {profile.id}
      </Text>
      <Text className="text-muted-foreground opacity-40   mx-auto text-sm">
        Versión 1.0.3
      </Text>

      <View className="absolute bottom-[350px] right-[-150px] w-[200px] h-[300px] rounded-xl rotate-[-45deg] bg-orange-300 shadow-lg" />

      <View className="absolute bottom-[275px] right-[-150px] w-[200px] h-[300px] rounded-xl rotate-[-50deg] bg-orange-400 shadow-lg" />

      <View className="absolute bottom-[200px] right-[-150px] w-[200px] h-[300px] rounded-xl rotate-[-60deg] bg-orange-500 shadow-lg" />
    </View>
  );
}
