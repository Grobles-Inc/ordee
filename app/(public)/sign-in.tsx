import { supabase } from "@/utils";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
type TLogin = {
  email: string;
  password: string;
};

export default function SignInScreen() {
  const [loading, setLoading] = React.useState(false);

  const [secureEntry, setSecureEntry] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TLogin>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmitWithoutEmail = async () => {
    await supabase.auth.signInWithPassword({
      email: "miguel@gmail.com",
      password: "miguel123",
    });
  };

  const onSubmit = async (data: TLogin) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      toast.error("Credenciales incorrectas!", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
    } else {
      reset();
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView className="bg-white dark:bg-zinc-900">
        <SafeAreaView className="flex flex-col justify-center align-middle m-4 items-center ">
          <View className="flex flex-col gap-8 w-full items-center web:md:w-1/3 web:md:mx-auto web:md:justify-center">
            <View className="flex flex-col items-center  mt-20">
              <Image
                style={{
                  width: 125,
                  height: 125,
                }}
                source={require("../../assets/images/logo.png")}
              />
              <View className="flex flex-col gap-1 items-center">
                <Text className="text-4xl font-bold dark:text-white">
                  Inicia Sesión
                </Text>
                <Text className="text-center dark:text-white">
                  Eres nuevo en la app?
                  <Text
                    className=" text-orange-500"
                    onPress={() => router.push("/(public)/sign-up")}
                  >
                    {" "}
                    Crea una cuenta
                  </Text>
                </Text>
              </View>
            </View>
            <View className="flex flex-col gap-4 justify-center align-middle w-full">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <View className="flex flex-col gap-2">
                    <TextInput
                      label="Correo Electrónico"
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
                  required: { value: true, message: "Requerido" },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Ingrese un correo electrónico válido",
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
              <Button
                mode="contained"
                style={{ marginTop: 20 }}
                onPress={handleSubmit(onSubmit)}
                loading={loading}
              >
                Iniciar Sesión
              </Button>
              <Button
                mode="contained-tonal"
                onPress={() => onSubmitWithoutEmail()}
              >
                Continuar como invitado
              </Button>
            </View>
            <View className=" flex flex-col gap-2">
              <Text className="text-muted-foreground text-zinc-400   mx-auto text-center px-4">
                Para sacar el máximo provecho y saber como usar la app visita la
                <Text
                  className=" text-orange-500"
                  onPress={() =>
                    openBrowserAsync("https://ordee.framer.website")
                  }
                >
                  {" "}
                  página web de Ordee
                </Text>
              </Text>
            </View>
            <View className="mt-6 flex flex-col ">
              <Text className="text-muted-foreground text-zinc-400   mx-auto text-sm">
                Desarrollado por
                <Text
                  className=" text-orange-500"
                  onPress={() =>
                    openBrowserAsync("https://grobles.framer.website")
                  }
                >
                  {" "}
                  Grobles
                </Text>
              </Text>
              <Text className="text-muted-foreground text-zinc-400   mx-auto text-sm">
                Versión 1.0.3
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
