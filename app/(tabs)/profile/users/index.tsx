import { UserSkeleton } from "@/components/skeleton/user";
import { useAuth } from "@/context/auth";
import { supabase } from "@/utils/supabase";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UsersScreen() {
  const { deleteUser, users, getUsers, profile, loading } = useAuth();
  React.useEffect(() => {
    getUsers(profile.id_tenant);
    supabase.channel("db-changes").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "accounts",
      },
      (payload) => {
        getUsers(profile.id_tenant);
      }
    );
  }, []);
  const onDelete = (id: string) => {
    Alert.alert("Eliminar", "¿Estás seguro de eliminar este usuario?", [
      {
        text: "Sí",
        style: "destructive",
        onPress: async () => {
          deleteUser(id);
          console.log("deleteUser", id);
        },
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      user: "Mesero",
      guest: "Cocinero",
      admin: "Administrador",
    };
    return roles[role as keyof typeof roles] || role;
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="p-4 dark:bg-zinc-900"
    >
      {loading && (
        <View className="flex flex-col gap-2 p-4">
          <UserSkeleton />
          <UserSkeleton />
          <UserSkeleton />
        </View>
      )}
      <FlashList
        renderItem={({ item: user }) => (
          <Card
            key={user.id}
            style={{
              marginVertical: 8,
              shadowOpacity: 0,
            }}
          >
            <Card.Title
              title={`${user.name} ${user.last_name}`}
              subtitle={getRoleLabel(user.role)}
              right={(props) => (
                <IconButton
                  icon="delete-outline"
                  onPress={() => onDelete(user.id as string)}
                  {...props}
                />
              )}
              left={(props) => (
                <Image
                  style={{
                    width: 45,
                    height: 45,
                  }}
                  source={{ uri: user.image_url }}
                />
              )}
            />
          </Card>
        )}
        data={users}
        estimatedItemSize={200}
        horizontal={false}
        ListEmptyComponent={
          <SafeAreaView className="flex flex-col gap-4 items-center justify-center mt-20">
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/17768/17768784.png",
              }}
              style={{ width: 100, height: 100, opacity: 0.5 }}
            />
            <Text style={{ color: "gray" }}>No hay usuarios para mostrar</Text>
          </SafeAreaView>
        }
      />
    </ScrollView>
  );
}
