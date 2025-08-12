import { ITable } from "@/interfaces";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Chip,
  Divider,
  IconButton,
  Text,
} from "react-native-paper";

import { useAuth } from "@/context/auth";
import { useTablesStore } from "@/context/tables";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

function TableSvg({ table }: { table: ITable }) {
  const { deleteTable } = useTablesStore();


  function onLongPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Borrar mesa", "¿Estás seguro de borrar esta mesa?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Aceptar",
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

  function onPress() {
    if (table.status) {
      router.push({
        pathname: "/add-order",
        params: { number: table.number, id_table: table.id },
      });
    } else {
      Alert.alert(
        "Mesa Ocupada",
        "No se pueden agregar pedidos a esta mesa",
        [
          {
            text: "Aceptar",
            onPress: () => { },
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
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
  const { addTable, tables, loading, getTables, subscribeToTables } = useTablesStore();
  const { profile, loading: authLoading } = useAuth();
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);
  const tableBottomSheetRef = useRef<BottomSheet>(null);
  const [number, setNumber] = useState<number>(0);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const snapPoints = useMemo(() => {
    if (isMobile) return ["50%"];
    return ["40%", "50%"];
  }, [isMobile]);
  const isDarkMode = colorScheme === "dark";



  async function onRefresh() {
    setRefreshing(true);
    if (profile?.id_tenant) {
      await getTables(profile.id_tenant);
    }
    setRefreshing(false);
  }
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

  const onSubmitTable = async (e: any) => {
    if (number <= 0) {
      toast.error("Número inválido. El número de mesa debe ser mayor a 0.");
      return;
    }
    if (profile?.id_tenant) {
      addTable({
        number,
        status: true,
      }, profile.id_tenant);
    }
    tableBottomSheetRef.current?.close();
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
    <SafeAreaView className="p-4 bg-white dark:bg-zinc-900 h-screen">
      <View className="flex flex-row pb-4 justify-between items-center web:p-4">
        <View className="flex flex-col gap-2">
          <Text
            className="text-4xl dark:text-white"
            style={{ fontWeight: "700" }}
          >
            Mesas
          </Text>
          <Text className="opacity-50 dark:text-white">
            Listado de mesas del local
          </Text>
        </View>
        {profile.role === "admin" && (
          <IconButton
            mode="contained"
            icon="plus"
            onPress={() => tableBottomSheetRef.current?.expand()}
          />
        )}
      </View>
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
      <BottomSheet
        ref={tableBottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: "gray" }}
        backgroundStyle={{
          backgroundColor: isDarkMode ? "#262626" : "white",
        }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="p-4 flex flex-col gap-4">
          <View className="flex flex-col gap-2">
            <Text variant="titleMedium">Registrar Mesa</Text>
            <BottomSheetTextInput
              className="border rounded-lg border-gray-200 p-4 w-full dark:border-zinc-700 text-black dark:text-white"
              keyboardType="numeric"
              placeholderTextColor={"gray"}
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
          </View>

          <Button mode="contained" onPress={onSubmitTable}>
            Registrar
          </Button>

          <Button
            onPress={() => tableBottomSheetRef.current?.close()}
            mode="text"
          >
            Cancelar
          </Button>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}
