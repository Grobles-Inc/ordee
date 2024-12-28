import { useAuth } from "@/context";
import { supabase } from "@/utils/supabase";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { Button, List, TextInput } from "react-native-paper";

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
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const { getUsers, profile } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IUser>({
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      password: "",
      role: "Administrador",
    },
  });

  const onSubmit = async (data: IUser) => {
    setLoading(true);
    try {
      // Crear usuario sin iniciar sesión
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email: data.email,
          password: data.password,
          email_confirm: true,
        });

      if (authError) {
        if (authError.message.includes("already registered")) {
          alert("Este correo electrónico ya está registrado");
          return;
        }
        throw authError;
      }

      if (!authData.user?.id) {
        throw new Error("No se pudo crear el usuario");
      }
      const { data: tenantData, error: tenantError } = await supabase
        .from("tenants")
        .select("id")
        .eq("id", "id_tenant")
        .single();

      // Create user profile
      const { error: profileError } = await supabase.from("accounts").insert({
        id: authData.user.id,
        name: data.name,
        last_name: data.last_name,
        role: data.role,
        image_url: data.image_url,
        id_tenant: profile.id_tenant,
      });

      if (profileError) throw profileError;
      alert("Usuario agregado exitosamente");
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
    <ScrollView
      className="flex flex-col p-4"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Controller
        control={control}
        name="image_url"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <TextInput
              label="URL de foto de perfil (opcional)"
              value={value}
              onChangeText={onChange}
              mode="outlined"
            />
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
              <Text className="text-red-500 ml-4">{errors.email.message}</Text>
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
              secureTextEntry
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
                  title="Mesero"
                  onPress={() => {
                    onChange("user");
                    setExpanded(!expanded);
                  }}
                />
                <List.Item
                  title="Cocinero"
                  onPress={() => {
                    onChange("guest");
                    setExpanded(!expanded);
                  }}
                />
                <List.Item
                  title="Administrador"
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
  );
}
