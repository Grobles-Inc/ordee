import { CategorySkeleton } from "@/components/skeleton/category";
import { useCategoryContext } from "@/context/category";
import { supabase } from "@/utils/supabase";
import { FontAwesome5 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoriesScreen() {
  const { deleteCategory, getCategories, categories, loading } =
    useCategoryContext();
  React.useEffect(() => {
    getCategories();
    supabase.channel("db-changes").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "categories",
      },
      (payload) => {
        getCategories();
      }
    );
  }, []);

  const onDelete = (id: string) => {
    Alert.alert("Eliminar", "¿Estás seguro de eliminar esta categoría?", [
      {
        text: "Sí",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCategory(id);
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
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className=" bg-white dark:bg-zinc-900"
      >
        {loading && (
          <View className="flex flex-col gap-2 p-4">
            <CategorySkeleton />
            <CategorySkeleton />
            <CategorySkeleton />
          </View>
        )}
        <FlashList
          renderItem={({ item: category }) => (
            <Card
              key={category.id}
              style={{
                marginHorizontal: 16,
                marginVertical: 8,
              }}
            >
              <Card.Title
                title={`${category.name}`}
                left={(props) => (
                  <FontAwesome5 name="tag" color="#FF6247" {...props} />
                )}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="delete-outline"
                    onPress={() => onDelete(category.id || "")}
                  />
                )}
              />
              <Card.Content>
                <Text variant="bodyMedium" style={{ color: "gray" }}>
                  {category.description}
                </Text>
              </Card.Content>
            </Card>
          )}
          data={categories}
          estimatedItemSize={200}
          ListEmptyComponent={
            <SafeAreaView className="flex flex-col gap-4 items-center justify-center mt-20">
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/17768/17768803.png",
                }}
                style={{ width: 100, height: 100, opacity: 0.5 }}
              />
              <Text style={{ color: "gray" }}>No hay items para mostrar</Text>
            </SafeAreaView>
          }
          horizontal={false}
        />
      </ScrollView>
    </>
  );
}
