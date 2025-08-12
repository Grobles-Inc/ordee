import { useAuth } from "@/context/auth";
import { IPlan } from "@/interfaces";
import { sendWhatsAppMeessage, supabase } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";

const PaywallScreen = () => {
  const router = useRouter();
  const { profile, session } = useAuth();
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<IPlan>(
    profile.tenants?.plans as IPlan
  );
  const [isMonthly, setIsMonthly] = useState(true);
  const fetchPlans = async () => {
    const { data: plans, error } = await supabase
      .from("plans")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      console.log("Error fetching plans:", error.message);
    } else {
      setPlans(plans);
    }
  };

  const handleSelectPlanWithWhatsApp = () => {
    if (selectedPlan) {
      console.log("Comprar plan:", selectedPlan);
      sendWhatsAppMeessage(
        selectedPlan,
        profile.tenants?.name,
        profile?.name,
        session?.user.email,
        profile.tenants?.id
      );
    } else {
      console.log("No plan selected");
    }
  };
  const FREE_FEATURES_END = 6;
  const ESSENTIAL_FEATURES_END = 11;

  const getFeaturesForPlan = (planType: "free" | "essential" | "pro") => {
    switch (planType) {
      case "free":
        return features.slice(0, FREE_FEATURES_END);
      case "essential":
        return features.slice(FREE_FEATURES_END, ESSENTIAL_FEATURES_END);
      case "pro":
        return features.slice(ESSENTIAL_FEATURES_END);
      default:
        return [];
    }
  };
  const features = [
    "50 ordenes por día",
    "Registro de Clientes",
    "Registro de Categorías",
    "Reporte diario",
    "Administración del Menú",
    "Impresión de Comprobantes",
    "Todos los del plan Free incluidos",
    "Soporte Inmediato",
    "Actualizaciones futuras",
    "Órdenes ilimitadas",
    "Hasta 5 usuarios activos en simultáneo",
    "Todos los del plan Essential incluidos",
    "Request de branding para tu restaurante",
    "Sin límite de usuarios en simultáneo",
  ];

  const isDisabled = selectedPlan?.id === profile.tenants?.plans?.id;

  useEffect(() => {
    fetchPlans();
  }, []);
  return (
    <ScrollView
      className="flex-1 p-5"
      contentContainerStyle={{ paddingVertical: 30, paddingBottom: 100 }}
    >
      {/* Logo */}
      <View className="flex-row items-center justify-center mb-6">
        <Image
          source={require("../../../../../assets/images/logo.png")}
          style={{ width: 100, height: 100 }}
        />
      </View>

      {/* Header */}
      <Text className="text-center text-2xl font-bold  mb-1 dark:text-white">
        Planes Flexibles
      </Text>
      <View className="flex flex-row items-center mb-6 gap-1 justify-center">
        <Ionicons name="shield-checkmark-outline" size={16} color="gray" />
        <Text className="text-center opacity-40  dark:text-white">
          Cancela en cualquier momento
        </Text>
      </View>

      {/* Toggle Buttons */}
      <View className="flex-row justify-center mb-6">
        <TouchableOpacity
          className={`px-10 py-3 rounded-l-full ${isMonthly ? "bg-[#FF6247]" : "bg-gray-200"
            }`}
          onPress={() => setIsMonthly(true)}
        >
          <Text
            className={` ${isMonthly ? "text-white font-bold" : "text-gray-700"
              }`}
          >
            Mensual
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-10 py-3 rounded-r-full ${!isMonthly ? "bg-[#FF6247]" : "bg-gray-200"
            }`}
          onPress={() => setIsMonthly(false)}
        >
          <Text
            className={` ${!isMonthly ? "text-white font-bold" : "text-gray-700"
              }`}
          >
            Anual
          </Text>
        </TouchableOpacity>
      </View>

      {/* Planes  TRUE */}
      <View className="flex flex-col gap-4 mb-8">
        {plans
          .filter((plan) => plan.billing === (isMonthly ? "monthly" : "annual"))
          .map((plan) => (
            <TouchableOpacity
              key={plan.id}
              onPress={() => setSelectedPlan(plan)}
            >
              <View
                className={` p-4 border    rounded-2xl ${selectedPlan?.id === plan.id
                    ? "border-[#FF6247]  border-2 dark:bg-orange-800/20 bg-orange-500/10 "
                    : "border-zinc-200 dark:border-zinc-600"
                  }`}
              >
                {profile.tenants?.plans?.id === plan.id && (
                  <Text className="bg-teal-400 w-28 text-center  rounded-full px-2 py-1">
                    Plan Actual
                  </Text>
                )}

                <Text className="text-[#FF6247] text-lg font-bold text-center mb-1">
                  {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                </Text>
                <Text className=" text-center  font-bold  my-2 text-2xl dark:text-white">
                  S/. {plan.price.toFixed(2)} {isMonthly ? "/mes" : "/año"}
                </Text>
                <Text className="text-zinc-500 dark:text-zinc-400 text-sm text-center mb-8">
                  {plan.name === "free"
                    ? "Funcionalidades básicas."
                    : plan.name === "essential"
                      ? "Ordenes ilimitadas."
                      : "Ordenes y cuentas ilimitadas."}
                </Text>
                <View>
                  {getFeaturesForPlan(
                    plan.name as "free" | "essential" | "pro"
                  ).map((feature, index) => (
                    <View key={index} className="flex-row items-center mb-1">
                      <MaterialIcons name="check" size={20} color="#FF6247" />
                      <Text className="text-zinc-500 dark:text-zinc-400 ml-2">
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        <Text className="text-muted-foreground text-zinc-400 text-center ">
          Al continuar, estas de acuerdo con nuestros{" "}
          <Text
            className="underline"
            onPress={() =>
              openBrowserAsync(
                "https://ordee.framer.website/terms-and-conditions"
              )
            }
          >
            Términos y Condiciones
          </Text>{" "}
          y las{" "}
          <Text
            className="underline"
            onPress={() =>
              openBrowserAsync("https://ordee.framer.website/privacy-policy")
            }
          >
            Política de Privacidad
          </Text>
        </Text>
      </View>

      {/* Botones */}
      <View className="flex flex-col gap-2 mt-4">
        <Button
          mode="contained"
          onPress={handleSelectPlanWithWhatsApp}
          disabled={isDisabled}
        >
          Adquirir
        </Button>
        <Button mode="text" onPress={() => router.back()}>
          Quizá más tarde
        </Button>
      </View>
    </ScrollView>
  );
};

export default PaywallScreen;
