import { useAuth } from "@/context";
import { IPlan } from "@/interfaces";
import { handleIntegrationMP } from "@/utils/integrationmp";
import { supabase } from "@/utils/supabase";
import { MaterialIcons } from "@expo/vector-icons";
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
  const handleBuy = async () => {
    if (selectedPlan) {
      console.log("Comprar plan:", selectedPlan);
      const planData = await handleIntegrationMP(
        selectedPlan,
        profile.tenants?.name,
        profile?.name,
        session?.user.email
      );
      openBrowserAsync(planData);
    } else {
      console.log("No plan selected");
    }
  };

  const isDisabled = selectedPlan?.id === profile.tenants?.plans?.id;

  useEffect(() => {
    fetchPlans();
  }, []);
  return (
    <ScrollView
      className="flex-1 p-4"
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Logo */}
      <View className="flex-row items-center justify-center mb-4">
        <Image
          source={require("../../../../assets/images/logo.png")}
          style={{ width: 100, height: 100 }}
        />
      </View>

      {/* Header */}
      <Text className="text-center text-2xl font-bold  mb-1 dark:text-white">
        Comience a usar Pro
      </Text>
      <Text className="text-center opacity-40 mb-6 dark:text-white">
        Cancela en cualquier momento
      </Text>

      {/* Toggle Buttons */}
      <View className="flex-row justify-center mb-6">
        <TouchableOpacity
          className={`px-8 py-3 rounded-l-full ${
            isMonthly ? "bg-[#FF6247]" : "bg-gray-100 dark:bg-zinc-800"
          }`}
          onPress={() => setIsMonthly(true)}
        >
          <Text
            className={`font-bold ${
              isMonthly ? "text-white" : "text-zinc-900 dark:text-zinc-200"
            }`}
          >
            Mensual
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-8 py-3 rounded-r-full ${
            !isMonthly ? "bg-[#FF6247]" : "bg-gray-100 dark:bg-zinc-800"
          }`}
          onPress={() => setIsMonthly(false)}
        >
          <Text
            className={`font-bold ${
              !isMonthly ? "text-white" : "text-zinc-900 dark:text-zinc-200"
            }`}
          >
            Anual
          </Text>
        </TouchableOpacity>
      </View>

      {/* Planes  TRUE */}
      <View className="grid grid-cols-2 grid-rows-1 gap-4 mb-8">
        {plans
          .filter((plan) => plan.billing === (isMonthly ? "monthly" : "annual"))
          .map((plan) => (
            <TouchableOpacity
              key={plan.id}
              onPress={() => setSelectedPlan(plan)}
            >
              <View
                className={` p-4 border   rounded-2xl ${
                  selectedPlan?.id === plan.id
                    ? "border-[#FF6247]   border-2 dark:bg-orange-800/20 bg-orange-500/10 "
                    : ""
                }`}
              >
                <Text className="text-[#FF6247] text-lg font-bold text-center mb-1">
                  {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                </Text>
                <Text className=" text-center  font-bold  my-2 text-2xl dark:text-white">
                  S/. {plan.price.toFixed(2)} {isMonthly ? "/mes" : "/año"}
                </Text>
                <Text className="text-gray-400 text-sm text-center mb-8">
                  {plan.name === "free"
                    ? "Incluye órdenes limitadas."
                    : plan.name === "essential"
                    ? "Incluye órdenes ilimitadas."
                    : "Incluye órdenes y cuentas ilimitadas."}
                </Text>
                <View>
                  <View className="flex-row items-center mb-1">
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color="#FF6247"
                    />
                    <Text className="text-gray-500 ml-2">
                      {plan.name === "free"
                        ? "Órdenes limitadas"
                        : "Órdenes ilimitadas"}
                    </Text>
                  </View>
                  {plan.name === "pro" && (
                    <View className="flex-row items-center mb-1">
                      <MaterialIcons
                        name="check-circle"
                        size={20}
                        color="#FF6A00"
                      />
                      <Text className="text-gray-500 ml-2">
                        Cuentas ilimitadas
                      </Text>
                    </View>
                  )}

                  <View className="flex-row items-center mb-1">
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color="#FF6247"
                    />
                    <Text className="text-gray-500 ml-2">Soporte 24/7</Text>
                  </View>
                  <View className="flex-row items-center mb-1">
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color="#FF6A00"
                    />
                    <Text className="text-gray-500 ml-2">Sin anuncios</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </View>

      {/* Botones */}
      <View className="flex flex-col gap-2 mt-4">
        <Button mode="contained" onPress={handleBuy} disabled={isDisabled}>
          Adquirir
        </Button>
        <Button mode="text" onPress={() => router.back()}>
          Cancelar
        </Button>
      </View>
    </ScrollView>
  );
};

export default PaywallScreen;
