import { useAuth } from "@/context/auth";
import { useCategoryStore } from "@/context/category";
import { ICategory } from "@/interfaces";
import { router, Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Button as NativeButton,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { toast } from "sonner-native";

export default function ProfileLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const { addCategory } = useCategoryStore();
  const { profile } = useAuth();

  const showDialog = useCallback(() => setDialogVisible(true), []);
  const hideDialog = useCallback(() => setDialogVisible(false), []);

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
    hideDialog();
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
                  onPress={showDialog}
                />
              ) : (
                <Button mode="text" onPress={showDialog}>
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
      <Modal
        visible={dialogVisible}
        transparent
        animationType="none"
        onRequestClose={hideDialog}
      >
        <TouchableWithoutFeedback onPress={hideDialog}>
          <View className="flex-1 bg-black/70 justify-center items-center p-4">
            <TouchableWithoutFeedback>
              <Animated.View
                entering={SlideInDown.duration(300)}
                exiting={SlideOutDown.duration(200)}
                className="bg-white dark:bg-zinc-800 rounded-xl w-full max-w-sm"
              >
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                  <View className="p-6 flex flex-col gap-4">
                    <Text variant="titleLarge">Agregar Categoría</Text>

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
                    />

                    <View className="flex-row justify-end gap-3 mt-6">
                      <Button mode="text" onPress={hideDialog}>
                        Cancelar
                      </Button>
                      <Button mode="contained" onPress={onSubmitCategory}>
                        Agregar
                      </Button>
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
