import { useMealStore } from "@/context/meals";
import { IMeal } from "@/interfaces";
import { getPublicIdFromUrl } from "@/utils/cloudinary";
import { router } from "expo-router";
import React from "react";
import { Alert, Platform, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";

export function MealCard({ meal }: { meal: IMeal }) {
  const { deleteMeal } = useMealStore();
  const url = getPublicIdFromUrl(meal.image_url);

  const onDelete = (id: string) => {
    if (Platform.OS === "web") {
      if (confirm("¿Estás seguro de eliminar este item?")) {
        deleteMeal(id, url || "").catch((error: any) => {
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
              await deleteMeal(id, url || "");
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

  React.useEffect(() => {
    if (meal.quantity === 0 && meal.stock) {
      // Only update if stock is not already false
      useMealStore.getState().updateMeal({
        ...meal,
        stock: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card style={{ flex: 1, margin: 8 }}>
      <Card.Cover source={{ uri: meal.image_url }} style={{ height: 120 }} />
      <Card.Title
        title={meal.name}
        titleStyle={{ textDecorationLine: meal.stock ? "none" : "line-through" }}
        subtitle={`${meal.quantity} porciones`}
        subtitleStyle={{ color: meal.stock ? "#10B981" : "#c26775", fontWeight: "bold" }}
      />
      <Card.Actions >
        <IconButton icon="pencil" onPress={handlePress} />
        <IconButton
          icon="delete"
          onPress={() => {
            onDelete(meal.id);
          }}
        />
      </Card.Actions>
    </Card>
  );
}
