import { ITable } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Chip, Divider } from "react-native-paper";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

function TableSvg({ table, index }: { table: ITable; index: number }) {
  const rotation = useSharedValue(90);
  useEffect(() => {
    rotation.value = withDelay(
      index * 50,
      withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotation.value}deg` }],
    };
  });

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
            onPress: () => {},
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  }

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity onPress={onPress}>
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
    </Animated.View>
  );
}

export default function TablesScreen() {
  const [tables, setTables] = useState<ITable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const getTables = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("tables")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        throw error;
      }
      setTables(data || []);
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setupSubscription = useCallback(() => {
    if (channelRef.current) return;

    channelRef.current = supabase
      .channel("table-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tables",
        },
        () => {
          getTables();
        }
      )
      .subscribe();
  }, [getTables]);

  useFocusEffect(
    useCallback(() => {
      getTables();
      setupSubscription();

      return () => {
        if (channelRef.current) {
          channelRef.current.unsubscribe();
          channelRef.current = null;
        }
      };
    }, [getTables, setupSubscription])
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-zinc-900">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="p-4 bg-white dark:bg-zinc-900">
      <Text className="text-4xl dark:text-white" style={{ fontWeight: "700" }}>
        Mesas
      </Text>
      <Text className="opacity-50 dark:text-white">
        Listado de mesas del local
      </Text>
      <Divider style={{ marginTop: 16 }} />

      <ScrollView contentContainerStyle={{ paddingVertical: 40 }}>
        <View className="flex-row flex-wrap justify-center items-center  gap-8">
          {tables.map((table, index) => (
            <TableSvg key={table.id} table={table} index={index} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
