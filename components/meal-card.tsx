import { useMealContext } from "@/context/meals";
import { IMeal } from "@/interfaces";
import React from "react";
import { Alert } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";

export default function MealCard({ meal }: { meal: IMeal }) {
  const { deleteMeal } = useMealContext();
  const onDelete = (id: string) => {
    Alert.alert("Eliminar", "¿Estás seguro de eliminar este item?", [
      {
        text: "Sí",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMeal(id);
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
    <Card style={{ marginVertical: 16 }}>
      <Card.Cover
        source={{
          uri: meal.image_url,
        }}
      />
      <Card.Title
        title={meal.name}
        subtitle={` ${meal.quantity} porciones`}
        subtitleStyle={{ fontSize: 14, color: "gray" }}
      />
      <Card.Content className="flex flex-row justify-between items-center">
        <Text variant="titleLarge">{`S/. ${meal.price.toFixed(2)}`}</Text>
        <IconButton
          icon="delete-outline"
          onPress={() => {
            onDelete(meal.id);
          }}
        />
      </Card.Content>
    </Card>
  );
}
