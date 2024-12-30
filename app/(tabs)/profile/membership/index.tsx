import { useAuth } from "@/context";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView, View } from "react-native";
import { Button, Divider, Text } from "react-native-paper";

export default function Membership() {
  const router = useRouter();
  const { profile } = useAuth();
  if (!profile.tenants) return null;
  const createdAtFormatted = new Date(
    profile.tenants?.created_at
  ).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <SafeAreaView className="p-4 bg-white dark:bg-zinc-900 h-screen-safe">
      <View className="flex flex-col gap-6 px-4 py-8 ">
        <View className="flex flex-row gap-4 items-center ">
          <Image
            source={require("../../../../assets/images/logo.png")}
            style={{ width: 100, height: 100 }}
          />

          <View className="flex flex-col gap-1">
            <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
              {profile.tenants?.plans?.name === "essential"
                ? "Plan Essential"
                : profile.tenants?.plans?.name === "pro"
                ? "Plan Pro"
                : "Plan Gratuito"}
            </Text>

            <Text
              style={{
                color: "gray",
              }}
            >
              Adquisición: <Text>{createdAtFormatted}</Text>
            </Text>
            <Text
              style={{
                color: "gray",
              }}
            >
              Ciclo Facturación: <Text>Mensual </Text>
            </Text>
          </View>
        </View>
        <Divider />
        <View className="flex flex-col gap-4 rounded-xl">
          <View className="flex flex-row gap-4 items-center">
            <AntDesign name="infocirlce" size={24} color="#0ea5e9" />
            <Text className="text-xl">Información del Plan</Text>
          </View>
          <View className="flex flex-col gap-4 p-4">
            <Text>
              Esta información es de caracter informativo y no puede ser editada
              o modificada. Se cauteloso con la información que compartas.
            </Text>

            <View className="flex flex-row gap-1 items-center">
              <Text style={{ color: "gray" }}>Titular de la cuenta: </Text>
              <Text>
                {profile.name} {profile.last_name}
              </Text>
            </View>
            <View className="flex flex-row gap-1 items-center">
              <Text style={{ color: "gray" }}>UUID: </Text>
              <Text>{profile.id}</Text>
            </View>
          </View>
        </View>
        <Divider />

        <Text>Monto de Recargo</Text>
        <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
          S/. {profile.tenants?.plans?.price.toFixed(2)} soles /{" "}
          {profile.tenants?.plans?.billing === "monthly" ? "mes" : "año"}
        </Text>
        <Text style={{ color: "gray" }}>
          La renovación de la membresía tiene un costo de S/. S/.{" "}
          {profile.tenants.plans?.price.toFixed(2)} nuevos soles.
        </Text>

        <Button
          mode="contained"
          onPress={() => {
            router.push("/(tabs)/profile/membership/paywall");
          }}
        >
          Ver Planes
        </Button>
      </View>
    </SafeAreaView>
  );
}
