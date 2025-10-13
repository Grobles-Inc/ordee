import { ITable } from "@/interfaces";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Chip,
  Divider,
  Text,
  TextInput,
} from "react-native-paper";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

import { useAuth } from "@/context/auth";
import { useOrderStore } from "@/context/order";
import { useTablesStore } from "@/context/tables";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

function TableSvg({ table }: { table: ITable }) {
  const { deleteTable } = useTablesStore();
  const { getLatestOrderByTableId } = useOrderStore();

  function onLongPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Borrar mesa", "¿Estás seguro de borrar esta mesa?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Borrar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTable(table.id as string);
          } catch (error: any) {
            alert("Error al eliminar: " + error.message);
          }
        },
      },
    ]);
  }

  async function onPress() {
    if (table.status) {
      router.push({
        pathname: "/add-order",
        params: { number: table.number, id_table: table.id },
      });
    } else {
      Alert.alert("Mesa Ocupada", "¿Desea ver los pedidos de esta mesa?", [
        {
          text: "Cancelar",
          style: "destructive",
        },
        {
          text: "Ver Orden",
          onPress: async () => {
            try {
              const latestOrder = await getLatestOrderByTableId(
                table.id as string
              );
              if (latestOrder?.id) {
                router.push({
                  pathname: "/(auth)/(tabs)/orders/details/[id]",
                  params: { id: latestOrder.id },
                });
              } else {
                toast.error("No se encontró orden activa para esta mesa");
              }
            } catch (error) {
              toast.error("Error al obtener la orden");
              console.error("Error getting latest order:", error);
            }
          },
        },
      ]);
    }
  }

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <View className="flex flex-col items-center justify-center">
        {table.status ? (
          <Text className="text-2xl font-bold dark:text-white">
            {table.number}
          </Text>
        ) : (
          <Chip
            mode="flat"
            style={{ backgroundColor: "#ef4444" }}
            selectedColor="#fecaca"
          >
            Ocupado
          </Chip>
        )}
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/12924/12924575.png",
          }}
          style={{ width: 100, height: 100 }}
        />
      </View>
    </TouchableOpacity>
  );
}

export default function TablesScreen() {
  const { addTable, tables, loading, getTables, subscribeToTables } =
    useTablesStore();
  const { profile, loading: authLoading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [number, setNumber] = useState<number>(0);

  const showDialog = useCallback(() => setDialogVisible(true), []);
  const hideDialog = useCallback(() => setDialogVisible(false), []);

  async function onRefresh() {
    setRefreshing(true);
    if (profile?.id_tenant) {
      await getTables(profile.id_tenant);
    }
    setRefreshing(false);
  }

  const onSubmitTable = async (e: any) => {
    if (number <= 0) {
      toast.error("Número inválido. El número de mesa debe ser mayor a 0.");
      return;
    }
    if (profile?.id_tenant) {
      addTable(
        {
          number,
          status: true,
        },
        profile.id_tenant
      );
    }
    hideDialog();
    setNumber(0);
  };

  useEffect(() => {
    if (profile?.id_tenant) {
      getTables(profile?.id_tenant);
    }
  }, [profile?.id_tenant, authLoading]);

  useEffect(() => {
    if (profile?.id_tenant) {
      subscribeToTables(profile?.id_tenant);
    }
  }, [profile?.id_tenant]);

  if (loading || authLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-zinc-900">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-zinc-900">
      <Appbar.Header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
        <Appbar.Content titleStyle={{ fontWeight: "bold" }} title="Mesas" />
        {profile.role === "admin" && (
          <Appbar.Action
            icon="plus-circle-outline"
            size={32}
            onPress={showDialog}
          />
        )}
      </Appbar.Header>
      <Divider />

      <ScrollView
        contentContainerStyle={{ paddingVertical: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-row flex-wrap justify-center items-center  gap-8">
          {tables.map((table) => (
            <TableSvg key={table.number} table={table} />
          ))}
          {tables.length === 0 && (
            <SafeAreaView className="flex flex-col gap-4 items-center justify-center mt-20">
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/17768/17768766.png",
                }}
                style={{ width: 100, height: 100, opacity: 0.5 }}
              />
              <Text style={{ color: "gray" }}>No hay mesas para mostrar</Text>
            </SafeAreaView>
          )}
        </View>
      </ScrollView>

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
                  <View className="p-6">
                    <Text variant="titleLarge" className="mb-4">
                      Nueva Mesa
                    </Text>

                    <TextInput
                      mode="outlined"
                      keyboardType="numeric"
                      placeholder="Número de mesa"
                      value={number === 0 ? "" : number.toString()}
                      onChangeText={(text) => {
                        const parsedNumber = Number(text);
                        if (!isNaN(parsedNumber) && parsedNumber >= 0) {
                          setNumber(parsedNumber);
                        } else {
                          toast.error("Número no válido.");
                        }
                      }}
                    />
                    <View className="flex-row justify-end gap-3 mt-4 w-full">
                      <Button mode="text" onPress={hideDialog}>
                        <Text>Cancelar</Text>
                      </Button>
                      <Button mode="contained" onPress={onSubmitTable}>
                        <Text>Registrar</Text>
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
