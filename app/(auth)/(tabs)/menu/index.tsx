import { MealCard } from "@/components";
import { useCategoryContext, useMealContext } from "@/context";
import { supabase } from "@/utils";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Appbar,
  Divider,
  Menu,
  Searchbar,
  Text,
  Button
} from "react-native-paper";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";
export default function MenuScreen() {
  const { getDailyMeals, meals } = useMealContext();
  const [loading, setLoading] = React.useState(true);
  const { categories, getCategories } = useCategoryContext();
  const [search, setSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<string>();
  const [refreshing, setRefreshing] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [visibleA, setVisibleA] = React.useState(false);
  React.useEffect(() => {
    getCategories();
  }, []);
  React.useEffect(() => {
    setLoading(true);
    getDailyMeals();
    setLoading(false);
  }, []);
  React.useEffect(() => {
    supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "meals",
        },
        (payload) => {
          getDailyMeals();
        }
      )
      .subscribe();
  }, []);
  async function onRefresh() {
    setRefreshing(true);
    await getDailyMeals();
    setRefreshing(false);
  }

  const filteredMeals = meals.filter((meal) => {
    if (categoryId && meal.id_category !== categoryId) {
      return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return meal.name.toLowerCase().includes(query);
    }

    return true;
  });
  const [filter, setFilter] = useState("all"); // Estado para el filtro

  // Filtrar las comidas según el estado del filtro
  const filteredMealsForStock = meals.filter((meal) => {
    if (filter === "inStock") {
      return meal.stock; // Solo comidas en stock
    } else if (filter === "outOfStock") {
      return !meal.stock; // Solo comidas sin stock
    } else {
      return true; // Mostrar todas las comidas
    }
  });
  const getLabel = () => {
    if (filter === "inStock") return "En stock";
    if (filter === "outOfStock") return "Sin stock";
    return "Todos";
  };
  return (
    <View className="flex-1">
      <Appbar.Header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 ">
        <Appbar.Content title="Menú" titleStyle={{ fontWeight: "bold" }} />
        <Menu
          visible={visibleA}
          onDismiss={() => setVisibleA(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setVisibleA(true)}
              contentStyle={{
              flexDirection: "row", // Alinear texto e ícono en una fila
              alignItems: "center", // Centrar verticalmente
              justifyContent: "center", // Centrar horizontalmente
              paddingHorizontal: 5, // Espaciado interno
              }}
              style={{
              margin: 16,
              borderWidth: 0, // Sin borde
              borderRadius: 8,
              alignSelf: "center", // Centrar el botón en su contenedor
              backgroundColor: "#FF6247", // Color de fondo
              minWidth: 120, // Ancho mínimo para que el contenido se centre mejor
              }}
            >
              <Text className="flex align-middle gap-3 py-4" style={{ color: "white" }}>
                {getLabel()} 
                <Ionicons className="pt-10" name="chevron-down" size={20} color="white" />
                </Text>
              
            </Button>
          }
          contentStyle={{
            borderRadius: 12,
            marginTop: 60,
            marginLeft: 17 // Set padding top to 50
          }}
        >
          <Menu.Item
            onPress={() => {
              setFilter("all");
              setVisibleA(false);
            }}
            title="Todos"
            leadingIcon={filter === "all" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => {
              setFilter("inStock");
              setVisibleA(false);
            }}
            title="En stock"
            leadingIcon={filter === "inStock" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => {
              setFilter("outOfStock");
              setVisibleA(false);
            }}
            title="Sin stock"
            leadingIcon={filter === "outOfStock" ? "check" : undefined}
          />
        </Menu>
        <Appbar.Action
          icon="magnify"
          mode={search ? "contained-tonal" : undefined}
          selected={search}
          onPress={() => setSearch((prev) => !prev)}
        />
        
        <Menu
          visible={visible}
          style={{
            paddingTop: 50,
            paddingRight: 8,
            flexDirection: "row",
            justifyContent: "center",
          }}
          contentStyle={{
            borderRadius: 12,
          }}
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
          <Divider />

          <Menu.Item
            trailingIcon={categoryId === "" ? "check" : undefined}
            onPress={() => {
              setCategoryId("");
              setVisible(false);
            }}
            leadingIcon="book-alphabet"
            title="Ver Todos"
          />
          <Divider />
          <Text
            variant="labelSmall"
            style={{
              color: "gray",
            }}
            className="ml-4"
          >
            Categorías
          </Text>
          <Divider />
          {categories.map((category) => (
            <Menu.Item
              leadingIcon="book-outline"
              key={category.id}
              trailingIcon={category.id === categoryId ? "check" : undefined}
              onPress={() => {
                setCategoryId(category.id);
                setVisible(false);
              }}
              title={category.name}
            />
          ))}
          {categories.length === 0 && (
            <Menu.Item
              style={{
                opacity: 0.3,
              }}
              title="No hay categorías"
              onPress={() => {
                setVisible(false);
              }}
            />
          )}
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
        {/* Selector de filtro */}
        

        {/* Lista de comidas */}
        {loading && <ActivityIndicator className="mt-20" color="red" />}
        <FlashList
          refreshing={refreshing}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 100,
          }}
          onRefresh={onRefresh}
          renderItem={({ item: meal }) => <MealCard meal={meal} />}
          data={filteredMealsForStock} // Usar las comidas filtradas
          estimatedItemSize={200}
          horizontal={false}
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
