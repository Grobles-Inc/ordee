import { useCategoryStore } from "@/context/category";
import { ICategory } from "@/interfaces";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router, Stack } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button as NativeButton,
  Platform,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { toast } from "sonner-native";

export default function ProfileLayout() {
  const categoryBottomSheetRef = useRef<BottomSheet>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { addCategory } = useCategoryStore();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const snapPoints = useMemo(() => {
    if (isMobile) return ["50%"];
    return ["40%", "50%"];
  }, [isMobile]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );


  const onSubmitCategory = async (e: any) => {
    if (name === "") {
      toast.error("Ingrese un nombre para la categoría");
      return;
    }

    const data: ICategory = {
      name,
      description,
    };
    addCategory(data);
    categoryBottomSheetRef.current?.close();
    setName("");
    setDescription("");
  };

  useEffect(() => {
    categoryBottomSheetRef.current?.close();
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
                  onPress={() => categoryBottomSheetRef.current?.expand()}
                />
              ) : (
                <Button
                  mode="text"
                  onPress={() => categoryBottomSheetRef.current?.expand()}
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
      <BottomSheet
        ref={categoryBottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: "gray" }}
        backgroundStyle={{ backgroundColor: isDarkMode ? "#262626" : "white" }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="p-4 flex flex-col gap-4">
          <View className="flex flex-col gap-2">
            <Text variant="bodyMedium" style={{ color: "gray" }}>
              Nombre
            </Text>
            <BottomSheetTextInput
              className="border rounded-lg border-gray-200 p-4 w-full dark:border-zinc-700 text-black dark:text-white"
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>

          <View className="flex flex-col gap-2">
            <Text variant="bodyMedium" style={{ color: "gray" }}>
              Descripción
            </Text>
            <BottomSheetTextInput
              className="border rounded-lg border-gray-200 p-4 w-full dark:border-zinc-700 text-black dark:text-white"
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
          </View>

          <Button mode="contained" onPress={onSubmitCategory}>
            Registrar Categoría
          </Button>

          <Button
            onPress={() => categoryBottomSheetRef.current?.close()}
            mode="text"
          >
            Cancelar
          </Button>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
