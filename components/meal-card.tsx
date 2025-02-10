import { useMealContext } from "@/context";
import { IMeal } from "@/interfaces";
import { getPublicIdFromUrl } from "@/utils/cloudinary";
import { router } from "expo-router";
import React from "react";
import { Alert, Platform, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";

export function MealCard({ meal }: { meal: IMeal }) {
  const { deleteMeal } = useMealContext();
  const url = getPublicIdFromUrl(meal.image_url);
  const onDelete = (id: string) => {
    if (Platform.OS === "web") {
      if (confirm("¿Estás seguro de eliminar este item?")) {
        deleteMeal(id, url).catch((error: any) => {
          alert("Error al eliminar: " + error.message);
        });
      }
    } else {
      Alert.alert("Eliminar", "¿Estás seguro de eliminar este item?", [
        {
          text: "Sí",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMeal(id, url);
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
    }
  };

  const handlePress = () => {
    router.push({
      pathname: "/menu/add-meal",
      params: {
        id: meal.id,
      },
    });
  };
  return (
    <Card style={{ marginVertical: 16 }}>
      <Card.Cover
        source={{
          uri: meal.image_url,
        }}
      />
      <Card.Title
        title={meal.name}
        subtitle={` ${meal.quantity} porciones`}
        subtitleStyle={{ color: "gray" }}
      />
      <Card.Content className="flex flex-row justify-between items-center">
        <Text variant="titleLarge">{`S/. ${meal.price.toFixed(2)}`}</Text>
        <View className="flex flex-row">
          <IconButton icon="pencil-outline" size={20} onPress={handlePress} />
          <IconButton
            icon="delete-outline"
            size={20}
            onPress={() => {
              onDelete(meal.id);
            }}
          />
        </View>
      </Card.Content>
    </Card>
  );
}
