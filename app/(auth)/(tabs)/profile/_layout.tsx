import { useCategoryContext, useCustomer } from "@/context";
import { ICategory, ICustomer } from "@/interfaces";
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
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { toast } from "sonner-native";

export default function ProfileLayout() {
  const customerBottomSheetRef = useRef<BottomSheet>(null);
  const categoryBottomSheetRef = useRef<BottomSheet>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { addCategory } = useCategoryContext();
  const { addCustomer, loading } = useCustomer();
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ICustomer>({
    defaultValues: {
      full_name: "",
      total_free_orders: 0,
      total_orders: 0,
    },
  });
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

  const onSubmit = async (data: ICustomer) => {
    addCustomer({
      ...data,
      total_free_orders: Number(data.total_free_orders),
      total_orders: Number(data.total_orders),
    });
    customerBottomSheetRef.current?.close();
    reset();
  };

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
    customerBottomSheetRef.current?.close();
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
            headerLargeTitle: true,
            headerBackVisible: true,
            headerShadowVisible: true,
            headerLargeTitleShadowVisible: false,
            headerRight: () => {
              return Platform.OS === "ios" ? (
                <NativeButton
                  title="Cancelar"
                  color="#FF6247"
                  onPress={() => router.back()}
                />
              ) : (
                <Button mode="text" onPress={() => router.back()}>
                  Cancelar
                </Button>
              );
            },
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
          name="customers"
          options={{
            title: "Clientes Fijos",
            headerLargeTitle: true,
            headerShadowVisible: true,
            headerLargeTitleShadowVisible: false,
            headerBackVisible: true,

            headerRight: () => {
              return Platform.OS === "ios" ? (
                <NativeButton
                  title="Agregar"
                  color="#FF6247"
                  onPress={() => customerBottomSheetRef.current?.expand()}
                />
              ) : (
                <Button
                  mode="contained-tonal"
                  onPress={() => customerBottomSheetRef.current?.expand()}
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
        ref={customerBottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: "gray" }}
        backgroundStyle={{ backgroundColor: isDarkMode ? "#262626" : "white" }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="p-4 flex flex-col gap-4 ">
          <Controller
            control={control}
            name="full_name"
            rules={{
              required: "Requerido",
            }}
            render={({ field: { onChange, value } }) => (
              <View className="flex flex-col gap-2">
                <Text variant="bodyMedium" style={{ color: "gray" }}>
                  Nombres Completos
                </Text>
                <BottomSheetTextInput
                  className="border rounded-lg border-gray-200 p-4 w-full dark:border-zinc-700 text-black dark:text-white"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.full_name && (
                  <Text className="text-red-500 ml-4">
                    {errors.full_name.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="total_orders"
            render={({ field: { onChange, value } }) => (
              <View className="flex flex-col gap-2">
                <Text variant="bodyMedium" style={{ color: "gray" }}>
                  Total de Ordenes
                </Text>
                <BottomSheetTextInput
                  className="border rounded-lg border-gray-200 p-4 w-full dark:border-zinc-700 text-black dark:text-white"
                  value={String(value)}
                  onChangeText={onChange}
                />

                {errors.total_orders && (
                  <Text className="text-red-500 ml-4">
                    {errors.total_orders.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="total_free_orders"
            render={({ field: { onChange, value } }) => (
              <View className="flex flex-col gap-2">
                <Text variant="bodyMedium" style={{ color: "gray" }}>
                  Ordenes Gratis
                </Text>
                <BottomSheetTextInput
                  className="border rounded-lg border-gray-200 p-4 w-full dark:border-zinc-700 text-black dark:text-white"
                  value={String(value)}
                  onChangeText={onChange}
                />
                {errors.total_free_orders && (
                  <Text className="text-red-500 ml-4">
                    {errors.total_free_orders.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
          >
            Registrar Cliente
          </Button>

          <Button
            onPress={() => {
              customerBottomSheetRef.current?.close();
              setName("");
              setDescription("");
            }}
            mode="outlined"
          >
            Cancelar
          </Button>
        </BottomSheetView>
      </BottomSheet>
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
            mode="outlined"
          >
            Cancelar
          </Button>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
