import { useCustomer } from "@/context/customer";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useState } from "react";
import { ScrollView, useColorScheme, View } from "react-native";
import {
  IconButton,
  List,
  Modal,
  Portal,
  Searchbar,
  Text,
} from "react-native-paper";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useDebouncedCallback } from "use-debounce";
export default function CustomerFinder({
  watch,
  setValue,
  setIsRegisterDisabled,
  showCustomerModal,
  setShowCustomerModal,
}: {
  watch: any;
  setValue: any;
  setIsRegisterDisabled: (value: boolean) => void;
  showCustomerModal: boolean;
  setShowCustomerModal: (value: boolean) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const colorScheme = useColorScheme();
  const [searchText, setSearchText] = useState("");
  const { getCustomers, customers } = useCustomer();

  const debouncedSearch = useDebouncedCallback((text: string) => {
    setSearchQuery(text);
  }, 200);

  useEffect(() => {
    getCustomers();
  }, []);
  useEffect(() => {
    const selectedCustomer = customers.find(
      (c) => c.id === watch("id_fixed_customer")
    );
    const isFreeOrderSelected = watch("free");
    if (
      selectedCustomer &&
      selectedCustomer.total_free_orders === 0 &&
      isFreeOrderSelected
    ) {
      setIsRegisterDisabled(true);
    } else {
      setIsRegisterDisabled(false);
    }
  }, [watch("id_fixed_customer"), watch("free")]);
  const filteredCustomers = React.useMemo(
    () =>
      customers.filter((customer) =>
        customer.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [customers, searchQuery]
  );

  return (
    <Portal>
      <Animated.View entering={FadeInUp.duration(200)}>
        <Modal
          visible={showCustomerModal}
          onDismiss={() => {
            setShowCustomerModal(false);
            setSearchText("");
            setSearchQuery("");
          }}
          contentContainerStyle={{
            backgroundColor: colorScheme === "dark" ? "#18181b" : "white",
            padding: 16,
            position: "absolute",
            top: 65,
            width: "100%",
            minHeight: 500,
            justifyContent: "flex-start",
            borderBottomRightRadius: 16,
            borderBottomLeftRadius: 16,
          }}
        >
          <View className="flex-row justify-between  items-center mb-4">
            <Text
              style={{ color: "gray", paddingLeft: 10 }}
              variant="bodyLarge"
            >
              Seleccionar Cliente
            </Text>
            <IconButton
              icon="close"
              onPress={() => {
                setShowCustomerModal(false);
                setSearchText("");
                setSearchQuery("");
              }}
            />
          </View>
          <Searchbar
            placeholder="Buscar cliente..."
            onChangeText={(text) => {
              setSearchText(text);
              debouncedSearch(text);
            }}
            rippleColor={"#FF6247"}
            value={searchText}
            onClearIconPress={() => {
              setSearchText("");
              setSearchQuery("");
            }}
            autoFocus
          />

          <FlashList
            data={filteredCustomers}
            renderItem={({ item: customer }) => (
              <List.Item
                title={customer.full_name}
                onPress={() => {
                  setValue("id_fixed_customer", customer.id);
                  setShowCustomerModal(false);
                  setSearchText("");
                  setSearchQuery("");
                }}
                left={(props) => <List.Icon {...props} icon="account" />}
                right={(props) =>
                  watch("id_fixed_customer") === customer.id ? (
                    <List.Icon {...props} icon="check" />
                  ) : null
                }
              />
            )}
            estimatedItemSize={76}
            ListEmptyComponent={
              <View style={{ padding: 16, alignItems: "center" }}>
                <Text variant="bodyMedium">No se encontraron clientes</Text>
              </View>
            }
          />
        </Modal>
      </Animated.View>
    </Portal>
  );
}
