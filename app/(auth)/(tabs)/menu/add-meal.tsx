import { useCategoryContext, useMealContext } from "@/context";
import { IMeal } from "@/interfaces";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Divider,
  List,
  TextInput,
} from "react-native-paper";
import { toast } from "sonner-native";

export default function AddMealScreen() {
  const { addMeal, loading, getMealById, updateMeal } = useMealContext();
  const [meal, setMeal] = React.useState<IMeal>({} as IMeal);
  const { id } = useLocalSearchParams();
  const [image_url, setImage_url] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(false);
  const { categories, getCategories } = useCategoryContext();
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
      quantity: 0,
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
    getCategories();
  }, []);

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

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/diqe1byxy/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        setImage_url(data.secure_url);
        setIsLoading(false);
        return data.secure_url;
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
  };

  const onUpdate = async (data: IMeal) => {
    const { id_category } = data;
    const category = categories.find(
      (category) => category.name === id_category
    );
    if (!category && !id_category) {
      toast.error("Selecciona una categoría para el item");
      return;
    }
    updateMeal({
      ...data,
      id: meal.id,
      id_category: category?.id || meal.id_category,
      image_url: image_url as string,
    });
    reset();

    router.back();
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
        image_url: image_url as string,
      });
      reset();
    }
    router.back();
  };
  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator className="mt-20" />
      ) : (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View className="flex flex-col justify-center align-middle w-full p-4 gap-4">
            <View className="flex flex-col mb-4">
              <Text className="text-3xl font-bold">
                {id ? "Editar Item" : "Agregar Item"}
              </Text>
              <Text className="text-muted-foreground">
                {id
                  ? "Modifica los datos del item seleccionado"
                  : "Rellena los datos para crear tu item"}
              </Text>
            </View>
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

            <View className="flex flex-col gap-2 ">
              {image_url && !isLoading && (
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
              )}
              {isLoading && (
                <View className="flex flex-row gap-2 items-center justify-center mb-4">
                  <ActivityIndicator />
                  <Text className="text-sm text-[#FF6247] text-center">
                    Cargando ...
                  </Text>
                </View>
              )}

              <Button onPress={pickImage} mode="outlined" icon="camera">
                <Text>Seleccionar imagen</Text>
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
              <Button mode="text" onPress={() => router.back()}>
                Cancelar
              </Button>
            </View>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
