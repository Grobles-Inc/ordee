import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { supabase } from "@/utils";
import { AntDesign } from "@expo/vector-icons";
import * as Print from "expo-print";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  useColorScheme,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Chip,
  Divider,
  Modal,
  Portal,
  Text,
} from "react-native-paper";

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder>({} as IOrder);
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { getOrderById, loading, updatePaidStatus } = useOrderContext();
  React.useEffect(() => {
    getOrderById(params.id).then((order) => {
      setOrder(order);
    });
  }, [params.id]);
  useEffect(() => {
    supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tables",
        },
        (payload) => {
          getOrderById(params.id).then((order) => {
            setOrder(order);
          });
        }
      )
      .subscribe();
  }, []);
  useFocusEffect(
    useCallback(() => {
      getOrderById(params.id).then((order) => {
        setOrder(order);
      });
    }, [])
  );

  const confirmUpdate = () => {
    if (order?.id) {
      updatePaidStatus(order.id, true);
    }
    printOrder();
    setModalVisible(false);
    router.push("/(auth)/(tabs)/orders");
  };
  async function onRefresh() {
    setRefreshing(true);
    await getOrderById(params.id).then((order) => {
      setOrder(order);
    });
    setRefreshing(false);
  }
  const generateHTML = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `
       <!DOCTYPE html>
<html>
<head>
    <style>
        @page {
            size: 80mm auto;
            margin: 0;
        }
        @media print {
            body {
                width: 80mm !important;
            }
            .page-break {
                page-break-after: always;
            }
        }
        body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 8px;
            font-size: 12px;
        }
        .header-info {
            text-align: center;
            margin-bottom: 8px;
        }

        .logo img {
            max-width: 60px;
            height: auto;
            margin-bottom: 4px;
            isplay: flex;
            justify-content: center;
            flex-direction: column;
        }
        .logo h1 {
            margin: 0;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .items {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0;
            text-align: left;
        }
        .items th {
            font-size: 11px;
            padding: 2px;
            border-bottom: 1px solid #000;
            white-space: nowrap;
        }
        .items td {
            padding: 2px;
            font-size: 11px;
            border-bottom: 1px dotted #ccc;
        }
        .item-name {
            max-width: 100x;
            word-wrap: break-word;
            white-space: pre-wrap;
        }
        .quantity-col {
            width: 30px;
            text-align: center;
        }
        .price-col {
            width: 40px;
            text-align: right;
            white-space: nowrap;
        }
        .total-section {
            margin: 8px 0;
            padding: 4px 0;
            text-align: left;
            border-bottom: 1px solid #000;
            font-size: 12px;
        }
        .datetime {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            margin: 4px 0;
            opacity: 0.7;
        }
        .datetime div {
            margin-right: 8px;
        }
        .footer {
            text-align: center;
            margin-top: 8px;
            font-size: 11px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header-info">
        <div class="logo">
               <img src="${order.tenants?.logo}" alt="logo">

        <h1>${order.tenants?.name}</h1>
        </div>
        <table class="items">
            <tr>
                <th align="left">Ítem</th>
                <th align="center">Uds.</th>
                <th align="right">Precio</th>
                <th align="right">Total</th>
            </tr>
            ${order?.items
              .map(
                (item) => `
                <tr>
                    <td class="item-name">${item.name}</td>
                    <td class="quantity-col">${item.quantity}</td>
                    <td class="price-col">${(typeof item.price === "number"
                      ? item.price
                      : parseFloat(item.price)
                    ).toFixed(2)}</td>
                    <td class="price-col">${(
                      (typeof item.price === "number"
                        ? item.price
                        : parseFloat(item.price)) *
                      (typeof item.quantity === "number"
                        ? item.quantity
                        : parseInt(item.quantity))
                    ).toFixed(2)}</td>
                </tr>
            `
              )
              .join("")}
        </table>
        <div class="total-section">
            <table width="100%">
                <tr>
                    <td><strong>Total:</strong></td>
                    <td align="right"><strong>S/. ${order.total.toFixed(
                      2
                    )}</strong></td>
                </tr>
            </table>
        </div>
        <div class="datetime">
            <div>Mesa: ${order.id_table}</div>
            <div>Fecha: ${dateStr}</div>
            <div>Hora: ${timeStr}</div>
        </div>
        <div class="footer">
            GRACIAS POR SU VISITA!
        </div>
    </div>
</body>
</html>
    `;
  };
  const printOrder = async () => {
    const html = generateHTML();
    await Print.printAsync({
      html,
    });
  };
  return (
    <>
      <ScrollView
        className="p-4 bg-white dark:bg-zinc-900"
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && (
          <View className="h-screen-safe flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
          </View>
        )}

        <View className="flex flex-col justify-between min-h-[450px]">
          <View className="flex flex-col gap-10">
            <View className="flex flex-col gap-4">
              <View className="flex flex-row gap-2">
                <Chip icon={order.to_go ? "shopping" : "table-furniture"}>
                  {order.to_go ? "Para llevar" : "Para mesa"}
                </Chip>
                <Chip icon={order.served ? "check-circle" : "clock"}>
                  {order.served ? "Servido" : "En espera"}
                </Chip>

                {order.free && (
                  <Chip
                    style={{
                      backgroundColor: "#e7e5e4",
                    }}
                  >
                    Gratis
                  </Chip>
                )}
              </View>
              {order.id_customer && (
                <View className="flex flex-col gap-1 items-start">
                  <Text style={{ color: "gray" }}>Cliente:</Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {order.customers?.full_name}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex flex-col gap-4">
              <View className="flex flex-col gap-4">
                <View className="flex flex-row justify-between">
                  <Text variant="titleSmall" className="w-60">
                    Items de la Orden
                  </Text>
                  <Text variant="titleSmall">Precio/u</Text>
                  <Text variant="titleSmall">Und.</Text>
                </View>
                <Divider />
                {order?.items?.map((item, index) => (
                  <View key={index} className="flex flex-row justify-between">
                    <View className="flex flex-row items-center gap-2">
                      <AntDesign
                        name="checkcircleo"
                        size={20}
                        color="#10B981"
                      />
                      <Text className="w-44 text-lg">
                        {item?.name.toLocaleLowerCase()}
                      </Text>
                    </View>
                    <Text>S/.{item.price.toFixed(2)}</Text>
                    <Text>{item.quantity}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View className="flex flex-col gap-4">
            <Divider />

            <View className="flex flex-row justify-between">
              <Text variant="titleMedium">Importe Total</Text>
              <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
                S/.{order?.total?.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={{
              borderRadius: 16,
              padding: 24,
              marginHorizontal: 16,
              display: "flex",
              gap: 10,
              backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
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
              <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
                Imprimir Comprobante
              </Text>
              <Text>La orden ahora se registrará como pagada.</Text>
            </View>

            <View className="flex flex-col gap-4  mt-10">
              <Button mode="contained" onPress={confirmUpdate}>
                Aceptar
              </Button>
              <Button mode="outlined" onPress={() => setModalVisible(false)}>
                Cancelar
              </Button>
            </View>
          </Modal>
        </Portal>
      </ScrollView>
      <Button
        mode="contained"
        style={{ marginHorizontal: 16, marginVertical: 8 }}
        icon="printer-outline"
        onPress={() => {
          setModalVisible(true);
        }}
      >
        Imprimir Comprobante
      </Button>
    </>
  );
}
