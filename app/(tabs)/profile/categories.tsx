import { useCategoryContext } from "@/context/category";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { ActivityIndicator, Card, IconButton, Text } from "react-native-paper";

export default function CategoriesScreen() {
  const { deleteCategory, getCategories, categories, loading } =
    useCategoryContext();
  React.useEffect(() => {
    getCategories();
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
        {loading && <ActivityIndicator className="mt-20" />}
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
          horizontal={false}
        />
        {categories?.length === 0 && (
          <View className="flex flex-col gap-4 items-center justify-center mt-20">
            <Image
              source={{
                uri: "https://img.icons8.com/?size=200&id=119481&format=png&color=000000",
              }}
              style={{ width: 100, height: 100 }}
            />
            <Text style={{ color: "gray" }}>No hay items para mostrar</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}
