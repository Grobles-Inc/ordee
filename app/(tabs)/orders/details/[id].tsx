import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import * as Print from "expo-print";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Chip,
  Modal,
  Portal,
  Text,
} from "react-native-paper";

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder>({} as IOrder);
  const [modalVisible, setModalVisible] = useState(false);
  const { getOrderById, loading, updatePaidStatus } = useOrderContext();
  React.useEffect(() => {
    getOrderById(params.id).then((order) => {
      setOrder(order);
    });
  }, [params.id]);

  const confirmUpdate = () => {
    if (order?.id) {
      updatePaidStatus(order.id, true);
    }
    printOrder();
    setModalVisible(false);
  };
  const generateHTML = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `
      <html>
        <head>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }

            body {
              font-family: 'Courier New', monospace;
              width: 80mm;
              margin: 0;
              padding: 5mm;
              box-sizing: border-box;
            }

            /* Para impresión */
            @media print {
              body {
                width: 80mm;
              }
              .page-break {
                page-break-after: always;
              }
            }
            .logo {
              text-align: center;
              font-size: 24px;
              margin-bottom: 20px;
            }
            .logo h1 {
              font-size: 24px;
            }
            .logo img {
              max-width: 150px;
              height: auto;
              margin: 0 auto;
              display: block;
            }
            .header-info {
              font-size: 12px;
              text-align: center;
              margin-bottom: 20px;
            }
            .table-info {
              margin-bottom: 15px;
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
            }
            .items {
              width: 100%;
              margin-bottom: 15px;
            }
            .items td {
              padding: 3px 0;
            }
            .price-col {
              text-align: right;
            }
            .total-section {
              border-top: 1px solid #ccc;
              padding-top: 10px;
              margin-top: 10px;
            }
            .datetime {
              text-align: center;
              font-size: 12px;
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="logo">
            <h1>RINCONCITO SURCUBAMBINO</h1>
          </div>

          <div class="header-info">
            Av.Huancavelica N°380<br>
            Tel: 923 008 282
          </div>

          <div class="table-info">
            Mesa: ${order.id_table}<br>
            Atendido por: ${order?.users?.name}<br>
            Para llevar: ${order.to_go ? "Sí" : "No"}
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
                <td>${item.name}</td>
                <td align="center">${item.quantity}</td>
                <td class="price-col">${item.price.toFixed(2)}</td>
                <td class="price-col">${(item.price * item.quantity).toFixed(
                  2
                )}</td>
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
            Fecha: ${dateStr}<br>
            Hora: ${timeStr}
          </div>

          <div class="footer">
            GRACIAS POR SU VISITA<br>
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
    <ScrollView
      className="p-4 bg-white"
      contentInsetAdjustmentBehavior="automatic"
    >
      {loading && (
        <View className="h-screen-safe flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      )}

      <View className="flex flex-col gap-10">
        <View className="flex flex-col gap-4">
          <View className="flex flex-row gap-2">
            <Chip
              style={{
                backgroundColor: "#e7e5e4",
              }}
            >
              {order.to_go ? "Para llevar" : "Para mesa"}
            </Chip>

            <Chip
              style={{
                backgroundColor: "#e7e5e4",
              }}
              disabled={!order.served}
            >
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
          {order.id_fixed_customer && (
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
              <Text variant="titleSmall">Cantidad</Text>
            </View>
            <View
              style={{
                height: 1,
                borderWidth: 1,
                borderColor: "#e7e5e4",
                borderStyle: "dashed",
              }}
            />
            {order?.items?.map((item, index) => (
              <View key={index} className="flex flex-row justify-between">
                <Text className="w-44">{item?.name.toLocaleLowerCase()}</Text>
                <Text>S/. {item.price}</Text>
                <Text>{item.quantity}</Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            height: 1,
            borderWidth: 1,
            borderColor: "#e7e5e4",
            borderStyle: "dashed",
          }}
        />

        <View className="flex flex-row justify-between">
          <Text variant="titleMedium">Importe Total</Text>
          <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
            S/. {order?.total?.toFixed(2)}
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={() => {
            setModalVisible(true);
          }}
        >
          Imprimir Comprobante
        </Button>
      </View>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            borderRadius: 16,
            padding: 16,
            marginHorizontal: 16,
            display: "flex",
            gap: 10,
            backgroundColor: "#fff",
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
            <Text>
              Estás seguro de proceder con esta operación ? La order ahora se
              registrará como pagada.
            </Text>
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
  );
}
