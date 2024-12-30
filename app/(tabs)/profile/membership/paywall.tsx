import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/elements";

const PaywallScreen = () => {
  const router = useRouter();
  const [planSelected, setPlanSelected] = useState("esencial");
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <ScrollView
      className="flex-1 p-4"
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Logo */}
      <View className="flex-row items-center justify-center mb-6">
        <Image
          source={require("../../../../assets/images/logo.png")}
          style={{ width: 100, height: 100 }}
        />
      </View>

      {/* Header */}
      <Text className="text-center text-xl font-bold text-white mb-1">
        Comience a usar Pro
      </Text>
      <Text className="text-center text-gray-500 mb-6">
        Cancela en cualquier momento
      </Text>

      {/* Toggle Buttons */}
      <View className="flex-row justify-center mb-6">
        <TouchableOpacity
          className={`px-8 py-3 rounded-l-full ${
            isMonthly ? "bg-[#FF6247]" : "bg-gray-300"
          }`}
          onPress={() => setIsMonthly(true)}
        >
          <Text
            className={`font-bold ${
              isMonthly ? "text-white" : "text-gray-700"
            }`}
          >
            Mensual
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-8 py-3 rounded-r-full ${
            !isMonthly ? "bg-[#FF6247]" : "bg-gray-300"
          }`}
          onPress={() => setIsMonthly(false)}
        >
          <Text
            className={`font-bold ${
              !isMonthly ? "text-white" : "text-gray-700"
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
            className={` p-4 border border-gray-400  rounded-2xl ${
              planSelected === "esencial" ? "border-[#FF6247] border-2 " : ""
            }`}
          >
            <Text className="text-[#FF6247] text-lg font-bold text-center mb-1">
              Esencial
            </Text>
            <Text className="text-white text-center mb-2 text-lg">
              {isMonthly ? "S/. 20.00/mes" : "S/. 15.00/año"}
            </Text>
            <Text className="text-gray-400 text-sm text-center mb-2">
              Incluye órdenes ilimitadas.
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
            className={` p-4 border border-gray-400  rounded-2xl ${
              planSelected === "premium" ? "border-[#FF6247] border-2" : ""
            }`}
          >
            <Text className="text-[#FF6247] text-lg font-bold text-center mb-1">
              Premium
            </Text>
            <Text className="text-white text-center mb-2 text-lg">
              {isMonthly ? "S/. 20.00/mes" : "S/. 15.00/año"}
            </Text>
            <Text className="text-gray-400 text-sm text-center mb-2">
              Incluye órdenes y cuentas ilimitadas.
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
      <View className="flex flex-col gap-2 mt-10">
        <Button mode="contained" onPress={() => router.back()}>
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
