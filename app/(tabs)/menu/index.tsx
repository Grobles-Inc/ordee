import MealCard from "@/components/meal-card";
import { useCategoryContext } from "@/context/category";
import { useMealContext } from "@/context/meals";
import { IMeal } from "@/interfaces";
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
const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";
export default function MenuScreen() {
  const { getMealsByCategoryId, loading, getDailyMeals } = useMealContext();
  const [mealsByCategoryId, setMealsByCategoryId] = React.useState<
    IMeal[] | undefined
  >();
  const { categories, getCategories } = useCategoryContext();
  const [categoryId, setCategoryId] = React.useState<string | undefined>("2");
  const [refreshing, setRefreshing] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    getCategories();
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
        </Menu>
      </Appbar.Header>
      <View className="flex-1">
        {loading && <ActivityIndicator className="mt-20" />}
        <FlashList
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item: meal }) => <MealCard meal={meal} />}
          data={mealsByCategoryId}
          estimatedItemSize={200}
          horizontal={false}
          ListEmptyComponent={
            <View className="flex flex-col gap-4 items-center justify-center mt-20">
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=200&id=119481&format=png&color=000000",
                }}
                style={{ width: 100, height: 100 }}
              />
              <Text style={{ color: "gray" }}>No hay items para mostrar</Text>
            </View>
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
