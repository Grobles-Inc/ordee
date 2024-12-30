import { useAuth } from "@/context";
import { IUser } from "@/interfaces";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, ScrollView, Text, Touchable, View } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  ActivityIndicator,
  Avatar,
  Button,
  IconButton,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function EditProfileScreen() {
  const { updateProfile, loading, profile, session } = useAuth();
  const [image_url, setImage_url] = React.useState<string>(profile?.image_url);
  const [isLoading, setIsLoading] = React.useState(false);
  const headerHeight = useHeaderHeight();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IUser>({
    defaultValues: {
      name: profile?.name,
      email: session?.user.email,
      last_name: profile?.last_name,
    },
  });

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
  const onSubmit = async (data: IUser) => {
    updateProfile({
      name: data.name,
      last_name: data.last_name,
      image_url,
      id: profile?.id,
      id_tenant: profile?.id_tenant,
      role: profile?.role,
    });
    reset();
    router.back();
  };
  return (
    <SafeAreaView
      className="flex-1 justify-between p-4 h-screen-safe"
      style={{ paddingTop: headerHeight }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View className="flex flex-col gap-2 mb-8 justify-center items-center">
            {image_url && !isLoading && (
              <Avatar.Image
                size={120}
                source={{
                  uri: image_url,
                }}
              />
            )}
            {isLoading && (
              <View className="flex flex-row gap-2 items-center justify-center mb-4">
                <ActivityIndicator />
                <Text className="text-sm text-[#FF6247] text-center">
                  Cargando ...
                </Text>
              </View>
            )}
            {image_url && !isLoading && (
              <IconButton
                style={{
                  position: "absolute",
                  bottom: 0,
                  zIndex: 10,
                  left: 200,
                  right: 8,
                }}
                onPress={pickImage}
                mode="contained"
                icon="camera"
              />
            )}
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
                  label="Nombres"
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
            name="last_name"
            rules={{
              required: "Requerido",
            }}
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <TextInput
                  label="Apellidos"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  error={!!errors.last_name}
                />
                {errors.last_name && (
                  <Text className="text-red-500 ml-4">
                    {errors.last_name.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Ingrese un correo válido",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <TextInput
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  error={!!errors.email}
                />
                {errors.email && (
                  <Text className="text-red-500 ml-4">
                    {errors.email.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        >
          Actualizar Perfil
        </Button>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
