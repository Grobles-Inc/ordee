import { useAuth } from "@/context/auth";
import { useCategoryStore } from "@/context/category";
import { useMealStore } from "@/context/meals";
import { IMeal } from "@/interfaces";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { ActivityIndicator, Button, List, TextInput } from "react-native-paper";
import { toast } from "sonner-native";

export default function AddMealScreen() {
  const { addMeal, loading, getMealById, updateMeal } = useMealStore();
  const [meal, setMeal] = React.useState<IMeal>({} as IMeal);
  const { id } = useLocalSearchParams();
  const [image_url, setImage_url] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(false);
  const { categories, getCategories } = useCategoryStore();
  const { profile } = useAuth();
  const [expanded, setExpanded] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<IMeal>({
    defaultValues: {
      name: "",
      price: 0,
      id_category: "Seleccionar Categoría",
      quantity: "",
      image_url: "",
    },
  });

  async function handleGetMeal() {
    if (id) {
      await getMealById(id as string).then((meal) => {
        setMeal(meal);
        setValue("name", meal.name);
        setValue("price", meal.price);
        setValue("id_category", meal.categories?.name as string);
        setValue("quantity", meal.quantity);
        setImage_url(meal.image_url);
      });
    }
  }

  useEffect(() => {
    if (profile?.id_tenant) {
      getCategories(profile.id_tenant);
    }
  }, [profile?.id_tenant]);

  useEffect(() => {
    handleGetMeal();
  }, [id]);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.canceled) {
      try {
        setIsLoading(true);
        const base64Img = result.assets[0].base64;
        const formData = new FormData();
        formData.append("file", `data:image/jpeg;base64,${base64Img}`);
        formData.append("upload_preset", "ml_default");
        formData.append("folder", "ordee/meals");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/diqe1byxy/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        setImage_url(data.secure_url);
        return data.secure_url;
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onSubmit = async (data: IMeal) => {
    const { id_category } = data;
    const category = categories.find(
      (category) => category.name === id_category
    );

    if (Number(data.quantity) <= 0) {
      toast.error("Cantidad no válida");
      return;
    }
    if (Number(data.price) <= 0) {
      toast.error("Precio no válido");
      return;
    }
    if (!category?.id) {
      toast.error("Selecciona una categoría para el item");
      return;
    }
    if (!profile?.id_tenant) {
      toast.error("Error: ID de tenant no disponible");
      return;
    }
    if (category) {
      addMeal({
        ...data,
        id_category: category.id,
        price: Number(data.price),
        quantity: Number(data.quantity),
        image_url: image_url as string,
      }, profile.id_tenant);
      reset();
    }
    router.back();
  };

  const onUpdate = async (data: IMeal) => {
    const { id_category } = data;
    const category = categories.find(
      (category) => category.name === id_category
    );
    if (Number(data.quantity) < 0 || Number(data.quantity) === 0) {
      toast.error("Cantidad no válida");
      return;
    }

    if (Number(data.price) < 0 || Number(data.price) === 0) {
      toast.error("Precio no válido");
      return;
    }
    if (!category?.id && !meal.id_category) {
      toast.error("Selecciona una categoría para el item");
      return;
    }
    if (!profile?.id_tenant) {
      toast.error("Error: ID de tenant no disponible");
      return;
    }
    updateMeal({
      ...data,
      id: meal.id,
      id_category: category?.id || meal.id_category,
      price: Number(data.price),
      quantity: Number(data.quantity),
      image_url: image_url as string,
    });
    reset();

    router.back();  
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator className="mt-20" />
      ) : (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="flex flex-col justify-center align-middle w-full p-4">
            <Controller
              control={control}
              name="id_category"
              rules={{
                required: "Requerido",
              }}
              render={({ field: { onChange, value } }) => (
                <View className="mt-4">
                  <List.Section>
                    <List.Accordion
                      expanded={expanded}
                      title={value}
                      style={{
                        paddingVertical: 0,
                        borderWidth: 1,
                        borderRadius: 5,
                        marginTop: 0,
                      }}
                      onPress={() => setExpanded(!expanded)}
                    >
                      {categories.map((category) => (
                        <List.Item
                          key={category.id || category.name}
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
                    <Text className="text-red-500 ml-4">
                      {errors.name.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              name="price"
              rules={{
                required: "Requerido",
              }}
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <TextInput
                    label="Precio Unitario"
                    placeholder="0.00"
                    value={value === 0 ? "" : value.toString()}
                    onChangeText={(text) => onChange(text === "" ? 0 : Number(text))} // Manejar conversión correctamente
                    mode="outlined"
                    keyboardType="numeric"
                    error={!!errors.price}
                  />
                  {errors.price && (
                    <Text className="text-red-500 ml-4">
                      {errors.price.message}
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
              }}
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <TextInput
                    label="Cantidad"
                    placeholder="0"
                    value={value === 0 ? "" : value.toString()}
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

            <View className="flex flex-col gap-4 items-center">
              {image_url && !isLoading && (
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
              )}
              {isLoading && <ActivityIndicator />}

              <Button
                onPress={pickImage}
                mode="contained-tonal"
                icon="upload"
                disabled={isLoading}
              >
                <Text>{id ? "Cambiar imagen" : "Subir imagen"}</Text>
              </Button>
            </View>
            <View className="flex flex-col gap-2 mt-4">
              <Button
                mode="contained"
                style={{ marginTop: 50 }}
                onPress={id ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}
                disabled={loading}
              >
                {id ? "Actualizar" : "Registrar"} Item
              </Button>
            </View>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
