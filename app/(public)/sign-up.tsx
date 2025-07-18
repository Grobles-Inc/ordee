import { supabase } from "@/utils";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { toast } from "sonner-native";
import { z } from "zod";

const SignUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  company: z.string().min(1, "Company name is required"),
});

export default function SignUpScreen() {
  const [loading, setLoading] = React.useState(false);
  const [secureEntry, setSecureEntry] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      company: "",
      lastName: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setLoading(true);
    try {
      // Prepara los datos que necesita el trigger en options.data
      const userMetadata = {
        name: data.name,
        lastName: data.lastName, // Asegúrate de que el nombre de la clave coincida con lo que espera la función (lastName vs last_name)
        company: data.company,
        // Puedes añadir otros datos iniciales si tu función los maneja
      };

      // ÚNICA LLAMADA: El trigger se encargará del resto (crear tenant y account)
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: userMetadata // Pasar los datos para el trigger
        },
      });

      if (signUpError) {
        // El error ahora podría venir del trigger si falla (ej. company vacío, plan default no existe, error en INSERT en ordee.accounts)
        console.error("SIGNUP ERROR", signUpError);
        setLoading(false);

        alert(`Sign up failed: ${signUpError.message}`); // El mensaje puede ser genérico ("Database error saving new user")
        return;
      }

      if (!authData || !authData.user) {
        console.error("SIGNUP ISSUE", "No user data returned after sign up.");
        alert("Sign up process issue. Please try again or contact support.");
        setLoading(false);

        return;
      }

      // ¡Éxito! El usuario está en auth.users, y el trigger *debería* haber creado
      // el tenant en ordee.tenants y el account en ordee.accounts.
      console.log("Sign up successful, trigger executed:", authData.user);
      
      // Asignar rol "admin" por defecto al usuario recién registrado
      const { error: roleUpdateError } = await supabase
        .from("accounts")
        .update({ role: "admin" })
        .eq("id", authData.user.id);

      if (roleUpdateError) {
        console.error("Error updating user role:", roleUpdateError);
      }

      toast.success("Cuenta creada correctamente");


    } catch (error) {
      console.error("UNEXPECTED SIGNUP ERROR", error);
      setLoading(false);

      toast.error("Ocurrió un error inesperado durante el registro");
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView className="bg-white  dark:bg-zinc-900 p-4">
        <View className="flex flex-col gap-4 w-full items-center  web:md:w-1/3 web:md:mx-auto web:md:justify-center">
          <View className="flex flex-col items-center gap-8 mt-10">
            <Image
              style={{
                width: 125,
                height: 125,
              }}
              source={require("../../assets/images/logo.png")}
            />
            <View className="flex flex-col gap-1 items-center">
              <Text className="text-4xl font-bold dark:text-white">
                Crea una cuenta
              </Text>
              <Text className="text-center  dark:text-white">
                Ingresa tus datos para crear una cuenta
              </Text>
            </View>
          </View>
          <View className="flex flex-col gap-3 justify-center align-middle w-full">
            <Controller
              control={control}
              name="company"
              render={({ field: { onChange, value } }) => (
                <View className="flex flex-col gap-2">
                  <TextInput
                    label="Nombre del Negocio"
                    mode="outlined"
                    error={errors.company ? true : false}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.company && (
                    <View className="flex flex-row gap-1">
                      <Text className="text-red-500">
                        {errors.company.message}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              rules={{
                required: {
                  value: true,
                  message: "Ingrese el nombre del negocio",
                },
              }}
            />
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <View className="flex flex-col gap-2">
                  <TextInput
                    label="Nombres"
                    mode="outlined"
                    error={errors.name ? true : false}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.name && (
                    <View className="flex flex-row gap-1">
                      <Text className="text-red-500">
                        {errors.name.message}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              rules={{
                required: { value: true, message: "Ingrese tus nombres" },
              }}
            />
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, value } }) => (
                <View className="flex flex-col gap-2">
                  <TextInput
                    label="Apellidos"
                    mode="outlined"
                    error={errors.lastName ? true : false}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.lastName && (
                    <View className="flex flex-row gap-1">
                      <Text className="text-red-500">
                        {errors.lastName.message}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              rules={{
                required: { value: true, message: "Ingrese tus apellidos" },
              }}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View className="flex flex-col gap-2">
                  <TextInput
                    label="Email"
                    mode="outlined"
                    error={errors.email ? true : false}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.email && (
                    <View className="flex flex-row gap-1">
                      <Text className="text-red-500">
                        {errors.email.message}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              rules={{
                required: { value: true, message: "Ingrese el email" },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Ingrese un email válido",
                },
              }}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View className="flex flex-col gap-2">
                  <TextInput
                    label="Contraseña"
                    secureTextEntry={!secureEntry}
                    right={
                      <TextInput.Icon
                        onPress={() => setSecureEntry(!secureEntry)}
                        icon={secureEntry ? "eye" : "eye-off"}
                      />
                    }
                    mode="outlined"
                    error={errors.password ? true : false}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.password && (
                    <View className="flex flex-row gap-1">
                      <Text className="text-red-500">
                        {errors.password.message}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              rules={{
                required: { value: true, message: "Ingrese la contraseña" },
              }}
            />
          </View>
          <View className="flex flex-col gap-4 w-full">
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
            >
              Crear Cuenta
            </Button>
            <Text className="text-muted-foreground text-zinc-400   mx-auto">
              Ya tienes una cuenta?
              <Text className=" text-orange-500" onPress={() => router.back()}>
                {" "}
                Inicia Sesión
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
