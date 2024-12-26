import { useAuth } from "@/context/auth";
import { useHeaderHeight } from "@react-navigation/elements";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Card,
  Divider,
  FAB,
  IconButton,
  Text,
} from "react-native-paper";

export default function UsersScreen() {
  const { deleteUser, users, getUsers, profile, loading } = useAuth();
  React.useEffect(() => {
    getUsers(profile.id_tenant);
  }, []);
  const router = useRouter();
  const onDelete = (id: string) => {
    Alert.alert("Eliminar", "¿Estás seguro de eliminar este usuario?", [
      {
        text: "Sí",
        style: "destructive",
        onPress: async () => {
          deleteUser(id);
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
      waiter: "Mesero",
      chef: "Cocinero",
      admin: "Administrador",
    };
    return roles[role as keyof typeof roles] || role;
  };

  return (
    <View className="flex-1">
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
        <FlashList
          renderItem={({ item: user }) => (
            <Card
              key={user.id}
              style={{
                marginHorizontal: 16,
                marginVertical: 8,
                backgroundColor: "white",
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
            <View className="flex flex-col gap-4 items-center justify-center mt-20">
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=200&id=119481&format=png&color=000000",
                }}
                style={{ width: 100, height: 100 }}
              />
              <Text style={{ color: "gray" }}>
                No hay usuarios para mostrar
              </Text>
            </View>
          }
        />
      </ScrollView>
    </View>
  );
}
