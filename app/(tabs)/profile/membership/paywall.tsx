import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";

const PaywallScreen = () => {
  const router = useRouter();
  const [planSelected, setPlanSelected] = useState("esencial");
  const [isMonthly, setIsMonthly] = useState(true);

  function onSubmit() {
    Alert.alert(
      "¡Gracias por comprar!",
      `¡Ya estás usando el plan ${planSelected} facturado ${
        isMonthly ? "mensualmente" : "anualmente"
      }!`
    );
  }

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

      {/* Planes */}
      <View className="grid grid-cols-2 grid-rows-1 gap-4 mb-8">
        {/* Plan Esencial */}
        <TouchableOpacity onPress={() => setPlanSelected("esencial")}>
          <View
            className={` p-4 border   rounded-2xl ${
              planSelected === "esencial"
                ? "border-[#FF6247]   border-2 dark:bg-orange-800/20 bg-orange-500/10 "
                : ""
            }`}
          >
            <Text className="text-[#FF6247] text-lg font-bold text-center mb-1">
              Esencial
            </Text>
            <Text className=" text-center  font-bold  my-2 text-2xl dark:text-white">
              {isMonthly ? "S/. 20.00/mes" : "S/. 15.00/mes"}
            </Text>
            <Text className="text-gray-400 text-sm text-center mb-8">
              Flexibilidad para tus órdenes
            </Text>
            <View>
              <View className="flex-row items-center mb-1">
                <MaterialIcons name="check-circle" size={20} color="#FF6247" />
                <Text className="text-gray-500 ml-2">Órdenes ilimitadas</Text>
              </View>

              <View className="flex-row items-center mb-1">
                <MaterialIcons name="check-circle" size={20} color="#FF6247" />
                <Text className="text-gray-500 ml-2">Soporte 24/7</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {/* Plan Premium */}
        <TouchableOpacity onPress={() => setPlanSelected("premium")}>
          <View
            className={` p-4 border  rounded-2xl ${
              planSelected === "premium"
                ? "border-[#FF6247] border-2  dark:bg-orange-800/20 bg-orange-500/10"
                : ""
            }`}
          >
            <Text className="text-[#FF6247] text-lg font-bold text-center mb-1">
              Premium
            </Text>
            <Text className="font-bold text-center my-2 text-2xl dark:text-white">
              {isMonthly ? "S/. 30.00/mes" : "S/. 20.00/mes"}
            </Text>
            <Text className="text-gray-400 text-sm text-center mb-8 ">
              Incluye órdenes y cuentas ilimitadas
            </Text>
            <View className="flex flex-col *:mb-4">
              <View className="flex-row items-center mb-1">
                <MaterialIcons name="check-circle" size={20} color="#FF6247" />
                <Text className="text-gray-500 ml-2">Órdenes ilimitadas</Text>
              </View>
              <View className="flex-row items-center mb-1">
                <MaterialIcons name="check-circle" size={20} color="#FF6247" />
                <Text className="text-gray-500 ml-2">Cuentas ilimitadas</Text>
              </View>
              <View className="flex-row items-center mb-1">
                <MaterialIcons name="check-circle" size={20} color="#FF6247" />
                <Text className="text-gray-500 ml-2">Soporte 24/7</Text>
              </View>
              <View className="flex-row items-center mb-1">
                <MaterialIcons name="check-circle" size={20} color="#FF6247" />
                <Text className="text-gray-500 ml-2">Sin anuncios</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Beneficios */}

      {/* Botones */}
      <View className="flex flex-col gap-2 mt-4">
        <Button
          mode="contained"
          onPress={() => {
            onSubmit();
            router.back();
          }}
        >
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
