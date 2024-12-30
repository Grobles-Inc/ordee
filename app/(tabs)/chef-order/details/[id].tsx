import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { Button, Divider, Modal, Portal, Text } from "react-native-paper";
import { supabase } from "@/utils/supabase";
export default function OrderDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { updateOrderServedStatus, getOrderById } = useOrderContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [order, setOrder] = useState<IOrder>();
  React.useEffect(() => {
    getOrderById(params.id).then((order) => setOrder(order));
  }, [params.id]);

  React.useEffect(() => {
    const channel = supabase
      .channel("table-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        async () => {
          await supabase.from("orders").select("*");
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [params.id]);

  if (!order) return <Text>Loading...</Text>;

  return (
    <ScrollView
      className="p-4 bg-white"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="flex flex-col gap-12 mb-10">
        <View className="flex flex-col gap-4">
          <View className="flex flex-col gap-4">
            <View className="flex flex-row justify-between">
              <Text variant="titleSmall" className="w-48">
                Item
              </Text>
              <Text variant="titleSmall">Precio</Text>
              <Text variant="titleSmall">Cantidad</Text>
            </View>
            <Divider />
            {order.entradas.map((item, index) => (
              <View key={index} className="flex flex-row justify-between">
                <Text className="w-36">{item.name}</Text>
                <Text>S/. {item.price}</Text>
                <Text>{item.quantity}</Text>
              </View>
            ))}
            {order.fondos.map((item, index) => (
              <View
                key={index}
                className="flex flex-row w-full justify-between"
              >
                <Text className="w-36">{item.name}</Text>
                <Text>S/. {item.price}</Text>
                <Text>{item.quantity}</Text>
              </View>
            ))}
            {order.bebidas.map((item, index) => (
              <View
                key={index}
                className="flex flex-row w-full justify-between"
              >
                <Text className="w-36">{item.name}</Text>
                <Text>S/. {item.price}</Text>
                <Text>{item.quantity}</Text>
              </View>
            ))}
            {order.helados.map((item, index) => (
              <View
                key={index}
                className="flex flex-row w-full justify-between"
              >
                <Text className="w-36">{item.name}</Text>
                <Text>S/. {item.price}</Text>
                <Text>{item.quantity}</Text>
              </View>
            ))}
          </View>
        </View>
        <Divider className="border-dashed border-2" />
      </View>
      <Button
        mode="contained"
        onPress={() => {
          setModalVisible(true);
        }}
      >
        Preparado
      </Button>
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <View className="p-4 bg-white mx-4 rounded-lg flex flex-col gap-16">
            <View className="flex flex-row gap-4 items-center">
              <Image
                style={{
                  width: 50,
                  height: 50,
                }}
                source={{
                  uri: "https://img.icons8.com/?size=100&id=VQOfeAx5KWTK&format=png&color=000000",
                }}
              />
              <View className="flex flex-col gap-1">
                <Text variant="titleMedium">Estado del pedido</Text>
                <Text>El estado cambiará a </Text>
                <Text> servido, estás seguro ?</Text>
              </View>
            </View>
            <Button
              mode="contained"
              onPress={() => {
                updateOrderServedStatus(order.id ? order.id : "");
                setModalVisible(false);
                router.push("/(tabs)/chef-order");
              }}
            >
              Aceptar
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

