import { supabase } from "@/utils/supabase";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Linking, ScrollView, Text, View } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
type TLogin = {
  email: string;
  password: string;
};
export default function SignInScreen() {
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TLogin>();

  const onSubmit = async (data: TLogin) => {
  setLoading(true);
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
      return;
    }
    // Asegúrate de que la sesión se haya establecido correctamente
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user) {
      router.push("/(tabs)"); // Usa `push` para evitar conflictos de historial
    } else {
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    }
  } catch (err) {
    console.error("Error al autenticar:", err);
  } finally {
    setLoading(false);
    reset();
  }
};

  
  return (
    <ScrollView>
      <SafeAreaView className="flex flex-col justify-center align-middle m-4 items-center ">
        <View className="flex flex-col gap-16 w-full items-center">
          <View className="flex flex-col items-center gap-8 mt-20">
            <Image
              style={{
                width: 125,
                height: 125,
              }}
              source={require("../../assets/images/logo.png")}
            />
            <View className="flex flex-col gap-1 items-center">
              <Text className="text-4xl font-bold"> Inicia Sesión</Text>
              <Text className="text-center ">
                Ingresa las credenciales de tu cuenta
              </Text>
            </View>
          </View>
          <View className="flex flex-col gap-6 justify-center align-middle w-full">
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
              }}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View className="flex flex-col gap-2">
                  <TextInput
                    label="Contraseña"
                    secureTextEntry
                    mode="outlined"
                    error={errors.password ? true : false}
                    onChangeText={onChange}
                    value={value}
                    right={<TextInput.Icon icon="lock" />}
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
              onPress={handleSubmit(onSubmit)}
              loading={loading}
            >
              Iniciar Sesión
            </Button>
          </View>
          <View className="mt-20 flex flex-col gap-2">
            <Text className="text-muted-foreground text-zinc-400   mx-auto">
              Desarrollado por
              <Text
                className="font-bold text-orange-500"
                onPress={() => Linking.openURL("https://grobles.netlify.app")}
              >
                {" "}
                Grobles
              </Text>
            </Text>
            <Text className="text-muted-foreground text-zinc-400   mx-auto text-sm">
              Versión 1.2.1
            </Text>
          </View>
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={() => setVisible(false)}>
            <View className="w-full flex flex-row justify-center items-center">
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=100&id=xNgsHu6eqArG&format=png&color=000000",
                }}
                style={{ width: 50, height: 50 }}
              />
            </View>

            <Dialog.Title>Credenciales Incorrectas</Dialog.Title>
            <Dialog.Content>
              <Text>
                Recuerda que la credenciales son precreadas, solicitalas en el
                area correspondiente
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor="red" onPress={() => setVisible(false)}>
                Cerrar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    </ScrollView>
  );
}
