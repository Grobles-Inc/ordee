import { useCustomer } from "@/context/customer";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { Alert, ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Card,
  Divider,
  IconButton,
  Text,
} from "react-native-paper";
export default function CustomersScreen() {
  const { deleteCustomer, customers, getCustomers, loading, addCustomer } =
    useCustomer();

  React.useEffect(() => {
    getCustomers();
  }, [customers]);

  const onDelete = (id: string) => {
    Alert.alert("Eliminar", "¿Estás seguro de eliminar este cliente?", [
      {
        text: "Sí",
        style: "destructive",
        onPress: async () => {
          try {
            deleteCustomer(id);
          } catch (error: any) {
            alert("Error al eliminar: " + error.message);
          }
        },
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="p-4 bg-white dark:bg-zinc-900"
    >
      {loading && <ActivityIndicator className="mt-20" />}
      <FlashList
        renderItem={({ item: customer }) => (
          <Card
            key={customer.id}
            style={{
              marginVertical: 8,
            }}
          >
            <Card.Title
              title={`${customer.full_name}`}
              subtitleStyle={{ fontSize: 16 }}
              left={(props) => (
                <Image
                  style={{
                    width: 45,
                    height: 45,
                  }}
                  source={{
                    uri: "https://img.icons8.com/?size=100&id=n8DrUm77sR3l&format=png&color=FD7E14",
                  }}
                />
              )}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="delete-outline"
                  onPress={() => onDelete(customer.id || "")}
                />
              )}
            />
            <Card.Content>
              <Divider className="mb-4" />
              <View className="flex flex-row  justify-between">
                <Text variant="bodyMedium" style={{ color: "gray" }}>
                  Total Pedidos : {customer.total_orders}
                </Text>
                <Text variant="bodyMedium" style={{ color: "gray" }}>
                  Pedidos Gratis : {customer.total_free_orders}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}
        data={customers}
        estimatedItemSize={200}
        horizontal={false}
      />
      {customers?.length === 0 && (
        <View className="flex flex-col gap-4 items-center justify-center mt-20">
          <Image
            source={{
              uri: "https://img.icons8.com/?size=200&id=119481&format=png&color=000000",
            }}
            style={{ width: 100, height: 100 }}
          />
          <Text style={{ color: "gray" }}>No hay clientes para mostrar</Text>
        </View>
      )}
    </ScrollView>
  );
}
