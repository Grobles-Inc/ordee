import { useCategoryContext } from "@/context/category";
import { useMealContext } from "@/context/meals";
import { IMeal } from "@/interfaces";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { Button, Divider, List, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { toast } from "sonner-native";
import { router } from "expo-router";

export default function AddMealScreen() {
  const { addMeal, loading } = useMealContext();
  const [image_url, setImage_url] = React.useState<string>();
  const [cloud_image_url, setCloud_image_url] = React.useState<string>();
  const { categories, getCategories } = useCategoryContext();
  const [expanded, setExpanded] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IMeal>({
    defaultValues: {
      name: "",
      price: 0,
      id_category: "Seleccionar Categoría",
      quantity: 0,
      image_url: "",
    },
  });

  useEffect(() => {
    getCategories();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.canceled) {
      setImage_url(result.assets[0].uri);
      const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;

      const apiUrl = "https://api.cloudinary.com/v1_1/diqe1byxy/image/upload";
      const data = {
        file: `ordee/${base64Img}`,
        upload_preset: "ml_default",
      };

      try {
        const response = await fetch(apiUrl, {
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });

        const uploadResult = await response.json();
        console.log("Cloudinary URL:", JSON.stringify(uploadResult));
        setCloud_image_url(uploadResult.secure_url);
        return uploadResult.secure_url;
      } catch (err) {
        console.error("Cloudinary Upload Error:", err);
      }
    }
  };

  const onSubmit = async (data: IMeal) => {
    const { id_category } = data;
    const category = categories.find(
      (category) => category.name === id_category
    );
    if (!category && !id_category) {
      toast.error("Selecciona una categoría para el item");
      return;
    }
    if (category) {
      addMeal({
        ...data,
        id_category: category?.id ?? "1",
        category: "Bebidas",
        image_url: cloud_image_url as string,
      });
      reset();
    }
    router.back();
  };
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View className="flex flex-col justify-center align-middle w-full p-4">
        <View className="flex flex-col gap-2 mb-8">
          {image_url ? (
            <View className="border border-dashed border-slate-500 rounded-xl p-4 mb-4 flex flex-row items-center justify-center">
              <Image
                source={{
                  uri: image_url,
                }}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 8,
                }}
              />
            </View>
          ) : (
            <View className="border border-dashed rounded-xl p-4 mb-4 border-slate-300 h-40" />
          )}
          <Text className="text-sm text-slate-500 text-center">
            La imagen será mostrada en la lista de comidas
          </Text>
          <Button onPress={pickImage} mode="outlined" icon="camera">
            <Text>Seleccionar imagen</Text>
          </Button>
        </View>

        <Controller
          control={control}
          name="name"
          rules={{
            required: "Requerido",
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="Descripción"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                error={!!errors.name}
              />
              {errors.name && (
                <Text className="text-red-500 ml-4">{errors.name.message}</Text>
              )}
            </View>
          )}
        />
        <Controller
          control={control}
          name="price"
          rules={{
            required: "Requerido",
            pattern: {
              value: /^[0-9]+$/,
              message: "Ingrese un valor válido",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="Precio Unitario"
                value={String(value)}
                onChangeText={onChange}
                mode="outlined"
                keyboardType="numeric"
                error={!!errors.name}
              />
              {errors.quantity && (
                <Text className="text-red-500 ml-4">
                  {errors.quantity.message}
                </Text>
              )}
            </View>
          )}
        />
        <Controller
          control={control}
          name="quantity"
          rules={{
            required: "Requerido",
            pattern: {
              value: /^[0-9]+$/,
              message: "Ingrese un valor válido",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="Cantidad"
                value={String(value)}
                onChangeText={onChange}
                mode="outlined"
                keyboardType="numeric"
                error={!!errors.quantity}
              />
              {errors.quantity && (
                <Text className="text-red-500 ml-4">
                  {errors.quantity.message}
                </Text>
              )}
            </View>
          )}
        />
        <Divider />
        <Controller
          control={control}
          name="id_category"
          rules={{
            required: "Requerido",
          }}
          render={({ field: { onChange, value } }) => (
            <View>
              <List.Section>
                <List.Accordion
                  expanded={expanded}
                  title={value}
                  style={{
                    paddingVertical: 0,
                    marginTop: 0,
                  }}
                  onPress={() => setExpanded(!expanded)}
                >
                  {categories.map((category) => (
                    <List.Item
                      key={category.id}
                      title={category.name}
                      onPress={() => {
                        onChange(category.name);
                        setExpanded(!expanded);
                      }}
                    />
                  ))}
                  {categories.length === 0 && (
                    <List.Item
                      style={{
                        opacity: 0.3,
                      }}
                      title="No hay categorías"
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                    />
                  )}
                </List.Accordion>
              </List.Section>
              {errors.id_category && (
                <Text className="text-red-500 ml-4">
                  {errors.id_category.message}
                </Text>
              )}
            </View>
          )}
        />
        <Divider />

        <Button
          mode="contained"
          style={{ marginTop: 50 }}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        >
          Registrar Item
        </Button>
      </View>
    </ScrollView>
  );
}
