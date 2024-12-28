import { useCategoryContext } from "@/context/category";
import { useMealContext } from "@/context/meals";
import { IMeal } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import {
  ActivityIndicator,
  Divider,
  IconButton,
  List,
  Text,
} from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderItemsAccordion({
  items,
  setItems,
}: {
  items: IMeal[];
  setItems: React.Dispatch<React.SetStateAction<IMeal[]>>;
}) {
  const {
    categories,
    getCategories,
    loading: categoriesLoading,
  } = useCategoryContext();
  const { getMealsByCategoryId, loading: mealsLoading } = useMealContext();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [categoryMeals, setCategoryMeals] = useState<Record<string, IMeal[]>>(
    {}
  );

  const handleQuantityChange = (item: IMeal, quantity: number) => {
    const newItemsSelected = [...items];
    const index = newItemsSelected.findIndex((i) => i.id === item.id);
    if (quantity > 0) {
      if (index === -1) {
        newItemsSelected.push({ ...item, quantity });
      } else {
        newItemsSelected[index] = { ...newItemsSelected[index], quantity };
      }
    } else {
      if (index !== -1) {
        newItemsSelected.splice(index, 1);
      }
    }
    setItems(newItemsSelected);
  };

  const mealsByCategoryHandler = async (categoryId: string) => {
    if (expandedId === categoryId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(categoryId);
    if (!categoryMeals[categoryId]) {
      const meals = await getMealsByCategoryId(categoryId);
      setCategoryMeals((prev) => ({
        ...prev,
        [categoryId]: meals,
      }));
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      {categoriesLoading && <ActivityIndicator style={{ marginTop: 20 }} />}
      {categories.map((category, index) => (
        <List.Section key={category.id}>
          <List.Accordion
            style={{
              paddingTop: 0,
              marginTop: 0,
            }}
            expanded={expandedId === category.id}
            title={category.name}
            onPress={() => mealsByCategoryHandler(category.id as string)}
          >
            {mealsLoading && <ActivityIndicator style={{ marginTop: 20 }} />}
            <Divider />
            <FlashList
              data={categoryMeals[category.id as string] || []}
              estimatedItemSize={74}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({ item, index }) => (
                <ItemAccordion
                  item={item}
                  index={index}
                  mealQuantity={item.quantity}
                  currentQuantity={
                    items.find((i) => i.id === item.id)?.quantity || 0
                  }
                  onQuantityChange={handleQuantityChange}
                />
              )}
              ListEmptyComponent={
                <View className="p-4 items-center flex flex-col justify-center h-20">
                  <Text variant="bodyMedium" style={{ color: "gray" }}>
                    Sin elementos
                  </Text>
                </View>
              }
              keyExtractor={(item) => item.id}
            />
          </List.Accordion>
          {index !== categories.length - 1 && <Divider />}
        </List.Section>
      ))}
      {categories.length === 0 && (
        <SafeAreaView className="flex flex-col gap-4 items-center justify-center p-8">
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/17768/17768803.png",
            }}
            style={{ width: 100, height: 100, opacity: 0.5 }}
          />
          <Text>No hay categorías para mostrar</Text>
          <Text
            variant="bodySmall"
            style={{ color: "gray", textAlign: "center" }}
          >
            Primero debes crear categorías en la sección de Perfil y luego
            agregar productos en el Tab de Menú.
          </Text>
        </SafeAreaView>
      )}
    </>
  );
}
const ItemAccordion = ({
  item,
  index,
  currentQuantity = 0,
  onQuantityChange,
  mealQuantity,
}: {
  item: IMeal;
  index: number;
  currentQuantity: number;
  onQuantityChange: (item: IMeal, quantity: number) => void;
  mealQuantity: number;
}) => {
  const [orderItemQuantity, setOrderItemQuantity] = useState(currentQuantity);
  useEffect(() => {
    setOrderItemQuantity(currentQuantity);
  }, [currentQuantity]);

  const handleQuantityUpdate = useCallback(
    (newQuantity: number) => {
      const validQuantity = Math.max(0, newQuantity);
      setOrderItemQuantity(validQuantity);
      onQuantityChange(item, validQuantity);
    },
    [onQuantityChange]
  );

  return (
    <Animated.View entering={FadeInDown.duration(200).delay(index * 100)}>
      <List.Item
        title={
          <View>
            <Text>{item.name}</Text>
          </View>
        }
        description={
          <View className="flex-row items-center gap-2">
            <Text variant="labelSmall" style={{ color: "gray" }}>
              S/. {item.price.toFixed(2)}
            </Text>
            <Text variant="labelSmall" style={{ color: "gray" }}>
              - {item.quantity} porciones
            </Text>
          </View>
        }
        right={(props) => (
          <View className="flex-row items-center gap-2">
            <IconButton
              onPress={() => handleQuantityUpdate(orderItemQuantity - 1)}
              disabled={orderItemQuantity === 0}
              mode="contained"
              icon="minus"
            />
            <Text variant="titleLarge">{orderItemQuantity}</Text>
            <IconButton
              mode="contained"
              disabled={orderItemQuantity === mealQuantity}
              onPress={() => handleQuantityUpdate(orderItemQuantity + 1)}
              icon="plus"
            />
          </View>
        )}
      />
    </Animated.View>
  );
};
