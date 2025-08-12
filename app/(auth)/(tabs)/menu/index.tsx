import { MealCard } from "@/components";
import { useAuth } from "@/context/auth";
import { useCategoryStore } from "@/context/category";
import { useMealStore } from "@/context/meals";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import {
  Appbar,
  Divider,
  Menu,
  Searchbar,
  Text
} from "react-native-paper";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

export default function MenuScreen() {
  const { getDailyMeals, meals, subscribeToMeals } = useMealStore();
  const { categories, getCategories } = useCategoryStore();
  const { profile } = useAuth();
  const [search, setSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string>();
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState("all"); // Estado para el filtro de stock

  useEffect(() => {
    if (profile?.id_tenant) {
      getCategories(profile.id_tenant);
      getDailyMeals(profile.id_tenant);
    }
  }, [profile?.id_tenant]);

  useEffect(() => {
    if (profile?.id_tenant) {
      const unsubscribe = subscribeToMeals(profile.id_tenant);
      return unsubscribe;
    }
  }, [profile?.id_tenant]);

  async function onRefresh() {
    setRefreshing(true);
    if (profile?.id_tenant) {
      await getDailyMeals(profile.id_tenant);
    }
    setRefreshing(false);
  }

  const filteredMeals = meals.filter((meal) => {
    if (categoryId && meal.id_category !== categoryId) return false;
    if (
      searchQuery.trim() &&
      !meal.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (filter === "inStock" && !meal.stock) return false;
    if (filter === "outOfStock" && meal.stock) return false;
    return true;
  });

  return (
    <View className="flex-1">
      <Appbar.Header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
        <Appbar.Content title="Menú" titleStyle={{ fontWeight: "bold" }} />
        <Appbar.Action icon="magnify" onPress={() => setSearch(!search)} />
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Appbar.Action icon={MORE_ICON} onPress={() => setVisible(true)} />
          }
        >
          <Menu.Item
            onPress={() => {
              router.push("/menu/add-meal");
              setVisible(false);
            }}
            leadingIcon="note-plus-outline"
            title="Agregar nuevo item"
          />
          <Menu.Item
            trailingIcon={categoryId === undefined ? "check" : undefined}
            onPress={() => {
              setCategoryId(undefined);
              setVisible(false);
            }}
            leadingIcon="book-alphabet"
            title="Ver Todos"
          />
          <Divider />
          <Text variant="labelSmall" style={{ color: "gray" }} className="ml-4">
            Categorías
          </Text>
          <Divider />
          {categories.map((category) => (
            <Menu.Item
              key={category.id}
              leadingIcon="book-outline"
              trailingIcon={category.id === categoryId ? "check" : undefined}
              onPress={() => {
                setCategoryId(category.id);
                setVisible(false);
              }}
              title={category.name}
            />
          ))}
          <Divider />
          <Text variant="labelSmall" style={{ color: "gray" }} className="ml-4">
            Stock
          </Text>
          <View style={{ paddingHorizontal: 16 }}>
            {["all", "inStock", "outOfStock"].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setFilter(option);
                  setVisible(false);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <Ionicons
                  name={
                    option === "all"
                      ? filter === "all"
                        ? "checkmark-circle"
                        : "list"
                      : option === "inStock"
                        ? filter === "inStock"
                          ? "checkmark-circle"
                          : "cube"
                        : filter === "outOfStock"
                          ? "checkmark-circle"
                          : "close-circle"
                  }
                  size={20}
                  color={filter === option ? "#FF6247" : "gray"}
                />
                <Text style={{ marginLeft: 10 }}>
                  {option === "all"
                    ? "Todos"
                    : option === "inStock"
                      ? "En stock"
                      : "Sin stock"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Menu>
      </Appbar.Header>
      {search && (
        <Animated.View className="m-4" entering={FadeInUp.duration(200)}>
          <Searchbar
            placeholder="Buscar item..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            mode="bar"
          />
        </Animated.View>
      )}
      <Divider className="hidden web:block" />
      <View className="flex-1">
        <FlashList
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={filteredMeals}
          renderItem={({ item: meal }) => <MealCard meal={meal} />}
          estimatedItemSize={200}
          horizontal={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ListEmptyComponent={
            <SafeAreaView className="flex flex-col items-center justify-center mt-20">
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/17768/17768786.png",
                }}
                style={{ width: 100, height: 100, opacity: 0.5 }}
              />
              <Text style={{ color: "gray" }}>No hay items para mostrar</Text>
            </SafeAreaView>
          }
        />
      </View>
    </View>
  );
}
