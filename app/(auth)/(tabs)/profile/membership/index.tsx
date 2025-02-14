import { useAuth } from "@/context";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView, ScrollView, View } from "react-native";
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
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100, justifyContent: "space-between" }}
      contentInsetAdjustmentBehavior="automatic"
      className="p-4 bg-white dark:bg-zinc-900 h-screen-safe flex-1"  
    >
      <View className="flex flex-col gap-6  py-8 ">
        <View className="flex flex-row gap-4 items-center ">
          <Image
            source={require("../../../../../assets/images/logo.png")}
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
        <View className="flex flex-col gap-4 rounded-xl p-4">
          <View className="flex flex-row gap-4 items-center">
            <AntDesign name="infocirlce" size={24} color="#0ea5e9" />
            <Text className="text-xl">Información del Plan</Text>
          </View>
          <View className="flex flex-col gap-4">
            <Text>
              Se aplican límites y restricciones para la membresía con el plan
              gratuito. Tienes permitidas sólo 50 ordenes por día.
            </Text>

            <View className="flex flex-row gap-1 items-center">
              <Text style={{ color: "gray" }}>Titular de la cuenta: </Text>
              <Text>
                {profile.name} {profile.last_name}
              </Text>
            </View>
            <View className="flex flex-row gap-1 items-center">
              <Text style={{ color: "gray" }}>UUID: </Text>
              <Text style={{ flexShrink: 1, flexWrap: 'wrap' }}>{profile.id}</Text>
            </View>
          </View>
        </View>
        <View className="flex flex-col gap-4 rounded-xl p-4">
          <Text>Monto de Recargo</Text>
          <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
            S/. {profile.tenants?.plans?.price.toFixed(2)} soles /{" "}
            {profile.tenants?.plans?.billing === "monthly" ? "mes" : "año"}
          </Text>
        </View>
      </View>
      <Button
        style={{
          margin: 16,
        }}
        mode="contained"
        onPress={() => {
          router.push("/(auth)/(tabs)/profile/membership/paywall");
        }}
      >
        Ver Planes
      </Button>
    </ScrollView>
  );
}
