import { useAuth } from "@/context/auth";
import { useCategoryStore } from "@/context/category";
import { ICategory } from "@/interfaces";
import { router, Stack } from "expo-router";
import React, {
  useEffect,
  useState,
} from "react";
import {
  Button as NativeButton,
  Platform,
  useColorScheme,
  View
} from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { toast } from "sonner-native";

export default function ProfileLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const { addCategory } = useCategoryStore();
  const { profile } = useAuth();



  const onSubmitCategory = async (e: any) => {
    if (name === "") {
      toast.error("Ingrese un nombre para la categoría");
      return;
    }

    const data: ICategory = {
      name,
      description,
    };
    addCategory(data, profile?.id_tenant);
    setDialogVisible(false);
    setName("");
    setDescription("");
  };

  useEffect(() => {
    setDialogVisible(false);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Mi Perfil",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="users"
          options={{
            title: "Usuarios",
            headerLargeTitle: true,
            headerBackVisible: true,
            headerShadowVisible: true,
            headerLargeTitleShadowVisible: false,

            headerRight: () => {
              return Platform.OS === "ios" ? (
                <NativeButton
                  title="Agregar"
                  color="#FF6247"
                  onPress={() => router.push("/profile/users/add-user")}
                />
              ) : (
                <Button
                  mode="text"
                  onPress={() => router.push("/profile/users/add-user")}
                >
                  Agregar
                </Button>
              );
            },
          }}
        />
        <Stack.Screen
          name="edit"
          options={{
            title: "Editar Perfil",
            headerBackVisible: true,
            headerShadowVisible: true,
            // headerRight: () => {
            //   return Platform.OS === "ios" ? (
            //     <NativeButton
            //       title="Cancelar"
            //       color="#FF6247"
            //       onPress={() => router.back()}
            //     />
            //   ) : (
            //     <Button mode="text" onPress={() => router.back()}>
            //       Cancelar
            //     </Button>
            //   );
            // },
          }}
        />
        <Stack.Screen
          name="membership"
          options={{
            title: "Membresía",
            headerLargeTitle: true,
            headerBackVisible: true,
            headerShadowVisible: true,
            headerLargeTitleShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="categories"
          options={{
            title: "Categorías",
            headerLargeTitle: true,
            headerBackVisible: true,
            headerShadowVisible: true,
            headerLargeTitleShadowVisible: false,

            headerRight: () => {
              return Platform.OS === "ios" ? (
                <NativeButton
                  title="Agregar"
                  color="#FF6247"
                  onPress={() => setDialogVisible(true)}
                />
              ) : (
                <Button
                  mode="text"
                  onPress={() => setDialogVisible(true)}
                >
                  Agregar
                </Button>
              );
            },
          }}
        />

        <Stack.Screen
          name="settings"
          options={{
            title: "Configuración",
            headerLargeTitle: true,
            headerShadowVisible: true,
            headerLargeTitleShadowVisible: false,
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="daily-report"
          options={{
            title: "Reporte",
            headerLargeTitle: true,
            headerBackVisible: true,
            headerShadowVisible: true,
            headerLargeTitleShadowVisible: false,
          }}
        />
      </Stack>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Registrar Categoría</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="Nombre"
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              mode="outlined"
              label="Descripción"
              value={description}
              onChangeText={(text) => setDescription(text)}
              style={{ marginTop: 16 }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
            <Button onPress={onSubmitCategory}>Registrar Categoría</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
