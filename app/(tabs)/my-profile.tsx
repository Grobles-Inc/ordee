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

      <View className="flex flex-col gap-8">
        <Image
          accessibilityLabel="tenant-logo"
          style={{
            width: 100,
            height: 100,
          }}
          source={{
            uri: profile.image_url,
          }}
        />
        <View className="flex flex-col gap-2">
          <Text variant="titleLarge">
            {profile.name} {profile.last_name}
          </Text>
          <Text>{getRoleLabel(profile.role)}</Text>
          <Text style={{ color: "gray" }}>{session?.user.email}</Text>
        </View>
      </View>
      <View className="flex flex-col mt-10 items-start ">
        <Button onPress={signOut} icon="logout" mode="contained">
          Cerrar Sesión
        </Button>
      </View>

      <Text className="text-muted-foreground opacity-40  mt-10 mx-auto ">
        {profile.id}
      </Text>
      <Text className="text-muted-foreground opacity-40   mx-auto text-sm">
        Versión 0.9.21
      </Text>

      <View className="absolute bottom-[150px] right-[-150px] w-[200px] h-[300px] rounded-xl rotate-[-45deg] bg-yellow-400 shadow-lg" />

      <View className="absolute bottom-[75px] right-[-150px] w-[200px] h-[300px] rounded-xl rotate-[-50deg] bg-white shadow-lg" />

      <View className="absolute bottom-[0px] right-[-150px] w-[200px] h-[300px] rounded-xl rotate-[-60deg] bg-orange-600 shadow-lg" />
    </View>
  );
}
