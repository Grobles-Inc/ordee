import { useAuth } from "@/context/auth";
import { IUser } from "@/interfaces";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View
} from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  IconButton,
  TextInput,
} from "react-native-paper";

export default function EditProfileScreen() {
  const { updateProfile, loading, profile, session } = useAuth();
  const [image_url, setImage_url] = React.useState<string>(profile?.image_url);
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IUser>({
    defaultValues: {
      name: profile?.name,
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
        formData.append("folder", "ordee/profiles");

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
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" className="p-4">
        <View className="flex flex-col gap-4">
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

          <View className="mb-4">
            <TextInput
              label="Email"
              disabled
              value={session?.user.email}
              mode="outlined"
              error={!!errors.email}
            />
          </View>
        </View>

        <Button
          mode="contained"
          style={{ marginTop: 20 }}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        >
          Actualizar Perfil
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
