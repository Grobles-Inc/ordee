import { useOrderStore } from "@/context/order";
import { IOrder } from "@/interfaces";
import { supabase } from "@/utils";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import * as Print from "expo-print";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableWithoutFeedback,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Chip,
  Divider,
  Text,
} from "react-native-paper";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const isMobile = useWindowDimensions().width < 768;
  const [order, setOrder] = useState<IOrder>({} as IOrder);
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { getOrderById, loading, updatePaidStatus } = useOrderStore();

  const showModal = useCallback(() => setModalVisible(true), []);
  const hideModal = useCallback(() => setModalVisible(false), []);

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
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              @page {
                  size: 80mm auto;
                  margin: 0;
              }
              @media print {
                  body {
                      width: 80mm !important;
                      margin: 0 !important;
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
                  width: 80mm;
              }
              .header-info {
                  text-align: center;
                  margin-bottom: 8px;
              }
              .logo img {
                  max-width: 60px;
                  height: auto;
                  margin-bottom: 4px;
                  display: flex;
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
                  max-width: 100px;
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
                          <td class="price-col">${(typeof item.price ===
                          "number"
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

    if (Platform.OS === "web") {
      const printFrame = document.createElement("iframe");
      printFrame.style.display = "none";
      document.body.appendChild(printFrame);

      const contentDocument = printFrame.contentDocument;
      const contentWindow = printFrame.contentWindow;

      if (!contentDocument || !contentWindow) {
        console.error("No se pudo acceder al documento o ventana del iframe");
        return;
      }

      contentDocument.write(html);
      contentDocument.close();

      const images = contentDocument.getElementsByTagName("img");
      if (images.length > 0) {
        await Promise.all(
          Array.from(images).map(
            (img) =>
              new Promise<void>((resolve) => {
                if (img.complete) {
                  resolve();
                } else {
                  img.onload = () => resolve();
                  img.onerror = () => resolve();
                }
              })
          )
        );
      }

      try {
        contentWindow.print();
      } finally {
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 1000);
      }
    } else {
      await Print.printAsync({
        html,
      });
    }
  };

  const confirmUpdate = async () => {
    if (order?.id) {
      await updatePaidStatus(order.id, true);
    }
    hideModal();
    printOrder();
    router.push("/(auth)/(tabs)/orders");
    if (Platform.OS === "web") {
      setTimeout(() => {
        router.reload();
      }, 500);
    }
  };

  async function onRefresh() {
    setRefreshing(true);
    await getOrderById(params.id).then((order) => {
      setOrder(order);
    });
    setRefreshing(false);
  }

  return (
    <View className="flex-1">
      <ScrollView
        className="bg-white dark:bg-zinc-900"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingVertical: 16 }}
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
            <View className="flex flex-col gap-4 px-4">
              <View className="flex flex-row gap-2">
                <Chip icon={order.to_go ? "shopping" : "table-furniture"}>
                  {order.to_go ? "Para llevar" : "Para mesa"}
                </Chip>
                {order.paid && (
                  <View className="bg-green-100 dark:bg-green-300 flex flex-row items-center justify-between  p-1.5 rounded-lg">
                    <FontAwesome6
                      name="check-circle"
                      size={16}
                      color="#10B981"
                    />
                    <Text className="text-green-600 px-2">Pagado</Text>
                  </View>
                )}
              </View>
            </View>

            <View className="flex flex-col gap-4">
              <View className="flex flex-col gap-4">
                <Divider />
                {order?.items?.map((item, index) => (
                  <View
                    key={index}
                    className="flex flex-row justify-between px-4 items-center"
                  >
                    <Text variant="titleMedium">
                      {item.name.slice(0, 25)}
                      {item.name.length > 25 ? "..." : ""}
                    </Text>
                    <Text>x {item.quantity}</Text>

                    <Text>S/. {item.price.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View className="flex flex-col gap-4">
            <Divider />
            <View className="flex flex-row justify-between px-4">
              <Text variant="titleLarge">Total</Text>
              <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
                S/. {order?.total?.toFixed(2)}
              </Text>
            </View>
          </View>

          <Modal
            visible={modalVisible}
            transparent
            animationType="none"
            onRequestClose={hideModal}
          >
            <TouchableWithoutFeedback onPress={hideModal}>
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
                        <View className="flex flex-col items-center gap-4 mb-6">
                          <Image
                            style={{
                              width: 60,
                              height: 60,
                            }}
                            source={{
                              uri: "https://img.icons8.com/?size=400&id=31337&format=png&color=ff6247",
                            }}
                          />
                          <Text
                            variant="titleLarge"
                            style={{ fontWeight: "bold" }}
                          >
                            Pagar Orden
                          </Text>
                        </View>

                        <Text
                          variant="bodyMedium"
                          style={{ textAlign: "center", marginBottom: 24 }}
                        >
                          La orden se marcará como pagada y podrás imprimir el
                          comprobante.
                        </Text>

                        <View className="flex-row justify-end gap-3">
                          <Button mode="text" onPress={hideModal}>
                            Cancelar
                          </Button>
                          <Button mode="contained" onPress={confirmUpdate}>
                            Aceptar
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
        <Button
          mode="contained"
          style={{ marginTop: 64, margin: 16 }}
          onPress={showModal}
        >
          Pagar Orden
        </Button>
      </ScrollView>
    </View>
  );
}
