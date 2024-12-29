import MealCard from "@/components/meal-card";
import { useCategoryContext } from "@/context/category";
import { useMealContext } from "@/context/meals";
import { IMeal } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Divider,
  Menu,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";
export default function MenuScreen() {
  const { getMealsByCategoryId, loading, getDailyMeals, meals } =
    useMealContext();
  const [mealsByCategoryId, setMealsByCategoryId] = React.useState<
    IMeal[] | undefined
  >();
  const { categories, getCategories } = useCategoryContext();
  const [categoryId, setCategoryId] = React.useState<string | undefined>("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    getCategories();
    getDailyMeals();
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

  React.useEffect(() => {
    getMealsByCategoryId(categoryId as string).then((meals) => {
      setMealsByCategoryId(meals);
    });
  }, [categoryId]);

  return (
    <>
      <Appbar.Header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
        <Appbar.Content
          title="Menú del Día"
          titleStyle={{ fontWeight: "bold" }}
        />
        <Menu
          visible={visible}
          style={{
            paddingTop: 50,
            paddingRight: 10,
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
            leadingIcon="plus"
            title="Agregar nuevo item"
          />
          <Divider />

          <Text
            style={{
              color: "gray",
            }}
            className="m-2"
          >
            Categorías
          </Text>
          <Divider />
          {categories.map((category) => (
            <Menu.Item
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
      <View className="flex-1">
        {loading && <ActivityIndicator className="mt-20" />}
        <FlashList
          refreshing={refreshing}
          contentContainerStyle={{
            padding: 16,
          }}
          onRefresh={onRefresh}
          renderItem={({ item: meal }) => <MealCard meal={meal} />}
          data={categoryId ? mealsByCategoryId : meals}
          estimatedItemSize={200}
          horizontal={false}
          ListEmptyComponent={
            <SafeAreaView className="flex flex-col  items-center justify-center mt-20">
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/17768/17768786.png",
                }}
                style={{ width: 100, height: 100, opacity: 0.5 }}
              />
              <Text style={{ color: "gray" }}>No hay items para mostrar</Text>
            </SafeAreaView>
          }
          ListFooterComponent={
            <Text
              variant="bodyMedium"
              style={{
                opacity: 0.3,
                margin: 16,
                textAlign: "center",
              }}
            >
              Items para el menú del día {new Date().toLocaleDateString()}
            </Text>
          }
        />
      </View>
    </>
  );
}
