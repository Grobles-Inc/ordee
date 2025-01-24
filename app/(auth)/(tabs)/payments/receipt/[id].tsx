import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { FontAwesome6 as Icon } from "@expo/vector-icons";
import * as Print from "expo-print";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { ActivityIndicator, Button, Divider, Title } from "react-native-paper";

export default function ReceiptDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder>({} as IOrder);
  const { getOrderById, loading } = useOrderContext();
  React.useEffect(() => {
    getOrderById(params.id).then((order) => {
      setOrder(order);
    });
  }, [params.id]);

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
                    <td class="price-col">${item.price.toFixed(2)}</td>
                    <td class="price-col">${(
                      item.price * Number(item.quantity)
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
  const orderDate = new Date(order.date ? order.date : Date.now());
  const dateStr = orderDate.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <ScrollView
      className=" bg-zinc-100 dark:bg-zinc-800"
      contentInsetAdjustmentBehavior="automatic"
    >
      {loading && (
        <View className="h-screen-safe flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      )}

      <View className="bg-white p-6 dark:bg-zinc-900">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-semibold dark:text-white">
            Orden Mesa #{order.tables?.number}
          </Text>
          <View className="bg-green-100 dark:bg-green-300 flex flex-row items-center justify-between  p-1.5 rounded-lg">
            <Icon name="check-circle" size={16} color="#10B981" />
            <Text className="text-green-600 px-2">Pagado</Text>
          </View>
        </View>

        <Text className="text-zinc-400">
          {dateStr} • S/.{order.total?.toFixed(2)}
        </Text>
      </View>

      <Text className="text-xs px-6 py-2 text-zinc-400">
        RESUMEN DEL PEDIDO
      </Text>

      <View className="bg-white p-6 dark:bg-zinc-900">
        <View className="flex-row items-center mb-4">
          <Image
            source={{
              uri: "https://img.icons8.com/?size=200&id=CIZkVfGggoVX&format=png&color=000000",
            }}
            className="w-14 h-14 p-2 mr-4 bg-zinc-100 rounded-lg"
          />
          <View>
            <Text className="text-lg font-bold dark:text-white">
              Orden de Alimentos
            </Text>
            <Text className="text-zinc-400 uppercase">
              {order.to_go ? "Para llevar" : "Para mesa"}
            </Text>
          </View>
        </View>
        <Divider className="mb-4" />
        <View className="flex flex-col gap-2">
          <View className="flex-row justify-between mb-2">
            <Text className="text-zinc-400 text-lg">Subtotal</Text>
            <Text className="text-lg dark:text-white">
              S/.{order.total?.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-zinc-400 text-lg">IGV (18.00%)</Text>
            <Text className="text-lg dark:text-white">S/.0.00</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-semibold text-zinc-400 text-lg">Total</Text>
            <Text className="font-bold text-lg dark:text-white">
              S/.{order.total?.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <Text className="text-xs px-6 py-2 text-zinc-400">CAMARERO</Text>
      <View className="bg-white p-4  dark:bg-zinc-900">
        <View className="flex-row items-center mb-4">
          <Image
            source={{ uri: order.users?.image_url }}
            className="w-12 h-12 mr-4 rounded-full"
          />

          <View className="flex flex-col  gap-1">
            <Text className="text-lg font-semibold dark:text-white">
              {order.users?.name} {order.users?.last_name}
            </Text>
            <Text className="text-zinc-400">
              UUID: {order.users?.id.slice(0, 25)}...
            </Text>
          </View>
        </View>
      </View>

      <Text className="text-xs px-6 py-2 text-zinc-400">ITEMS</Text>
      <View className="bg-white p-6 dark:bg-zinc-900">
        {order.items?.map((item, index) => (
          <View
            className="flex-row items-start mb-2 justify-between"
            key={index}
          >
            <View className="flex-row items-start mb-4 ">
              <Icon
                name="check-circle"
                size={20}
                color="#10B981"
                className="mr-4 mt-2"
              />
              <View className="flex flex-col ">
                <Text className="font-semibold text-lg dark:text-white">
                  {item.name}
                </Text>
                <Text className="text-sm text-zinc-400">
                  Cantidad: {item.quantity} porciones
                </Text>
              </View>
            </View>
            <Text className="text-gray-500 ">S/. {item.price.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <Button
        mode="contained"
        style={{ marginHorizontal: 20, marginTop: 40 }}
        icon="printer-outline"
        onPress={printOrder}
      >
        Imprimir Comprobante
      </Button>
      <Button
        mode="contained-tonal"
        style={{ margin: 20 }}
        onPress={() => router.back()}
      >
        Cerrar
      </Button>
    </ScrollView>
  );
}
