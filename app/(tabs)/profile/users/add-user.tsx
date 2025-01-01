import { useAuth } from "@/context";
import { supabaseAdmin, supabase } from "@/utils";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { ActivityIndicator, Button, List, TextInput } from "react-native-paper";
import { toast } from "sonner-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

interface IUser {
  name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  image_url?: string;
}

export default function AddUserScreen() {
  const router = useRouter();
  const [image_url, setImage_url] = React.useState<string>();
  const [secureEntry, setSecureEntry] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const { profile } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IUser>({
    defaultValues: {
      name: "",
      last_name: "",
      image_url: "",
      email: "",
      password: "",
      role: "Administrador",
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
    setLoading(true);
    try {
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email: data.email,
          password: data.password,
          email_confirm: true,
        });

      if (authError) {
        if (authError.message.includes("already registered")) {
          toast.error("Este correo electrónico ya está registrado");
          return;
        }
        throw authError;
      }

      if (!authData.user?.id) {
        throw new Error("No se pudo crear el usuario");
      }
      await supabase
        .from("tenants")
        .select("id")
        .eq("id", "id_tenant")
        .single();

      const { error: profileError } = await supabase.from("accounts").insert({
        id: authData.user.id,
        name: data.name,
        last_name: data.last_name,
        role: data.role,
        image_url: image_url as string,
        id_tenant: profile.id_tenant,
      });

      if (profileError) throw profileError;
      toast.success("Usuario agregado exitosamente", {
        icon: <FontAwesome name="check-circle" size={20} color="green" />,
      });
      reset();
      router.back();
    } catch (err: any) {
      console.error("Error:", err);
      alert(err.message || "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView className="p-4" contentInsetAdjustmentBehavior="automatic">
        <View className="flex flex-col gap-2 mb-8">
          {image_url && !isLoading ? (
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
          {isLoading && (
            <View className="flex flex-row gap-2 items-center justify-center mb-4">
              <ActivityIndicator />
              <Text className="text-sm text-[#FF6247] text-center">
                Cargando ...
              </Text>
            </View>
          )}

          <Button onPress={pickImage} mode="contained-tonal" icon="camera">
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
                label="Nombres"
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
              message: "Ingrese un correo valido",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="Correo"
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

        <Controller
          control={control}
          name="password"
          rules={{
            required: "Requerido",
            minLength: {
              value: 6,
              message: "La contraseña debe tener al menos 6 caracteres",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="Contraseña"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                secureTextEntry={!secureEntry}
                right={
                  <TextInput.Icon
                    onPress={() => setSecureEntry(!secureEntry)}
                    icon={secureEntry ? "eye" : "eye-off"}
                  />
                }
                error={!!errors.password}
              />
              {errors.password && (
                <Text className="text-red-500 ml-4">
                  {errors.password.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="role"
          rules={{
            required: "Campo requerido",
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <List.Section title="Rol del usuario">
                <List.Accordion
                  expanded={expanded}
                  title={value}
                  onPress={() => setExpanded(!expanded)}
                >
                  <List.Item
                    title="Usuario"
                    description="Ideal para meseros"
                    onPress={() => {
                      onChange("user");
                      setExpanded(!expanded);
                    }}
                  />
                  <List.Item
                    title="Invitado"
                    description="Ideal para cocineros"
                    onPress={() => {
                      onChange("guest");
                      setExpanded(!expanded);
                    }}
                  />
                  <List.Item
                    title="Admin"
                    description="Ideal para administradores"
                    onPress={() => {
                      onChange("admin");
                      setExpanded(!expanded);
                    }}
                  />
                </List.Accordion>
              </List.Section>
              {errors.role && (
                <Text className="text-red-500 ml-4">{errors.role.message}</Text>
              )}
            </View>
          )}
        />

        <Button
          mode="contained"
          style={{ marginTop: 50 }}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        >
          Registrar
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
