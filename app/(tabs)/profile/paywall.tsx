import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const PaywallScreen = () => {
  const router = useRouter();
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <ScrollView className="flex-1 p-5" contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Logo */}
      <View className="flex-row items-center justify-center mb-6">
        <Image
          source={require("../../../assets/images/logo.png")}
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
          className={`px-4 py-2 rounded-l-md ${isMonthly ? 'bg-orange-500' : 'bg-gray-300'}`}
          onPress={() => setIsMonthly(true)}
        >
          <Text className={`font-bold ${isMonthly ? 'text-white' : 'text-gray-700'}`}>Mensual</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 rounded-r-md ${!isMonthly ? 'bg-orange-500' : 'bg-gray-300'}`}
          onPress={() => setIsMonthly(false)}
        >
          <Text className={`font-bold ${!isMonthly ? 'text-white' : 'text-gray-700'}`}>Anual</Text>
        </TouchableOpacity>
      </View>

      {/* Planes */}
      <View className="grid grid-cols-2 grid-rows-1 gap-4 mb-8">
        {/* Plan Esencial */}
        <View className=" p-4 border border-gray-400 rounded-lg">
          <Text className="text-orange-500 text-lg font-bold text-center mb-1">Esencial</Text>
          <Text className="text-white text-center mb-2 text-lg">
            {isMonthly ? 'S/. 20.00/mes' : 'S/. 15.00/año'}
          </Text>
          <Text className="text-gray-400 text-sm text-center mb-2">
            Incluye órdenes ilimitadas.
          </Text>
          <View>
          <View className="flex-row items-center mb-1">
              <MaterialIcons name="check-circle" size={20} color="#FF6A00" />
              <Text className="text-gray-500 ml-2">Órdenes ilimitadas</Text>
            </View>
            
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="check-circle" size={20} color="#FF6A00" />
              <Text className="text-gray-500 ml-2">Soporte 24/7</Text>
            </View>
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="check-circle" size={20} color="#FF6A00" />
              <Text className="text-gray-500 ml-2">Sin anuncios</Text>
            </View>
          </View>
        </View>
        {/* Plan Premium */}
        <View className=" p-4 border border-orange-500 rounded-lg">
          <Text className="text-orange-500 text-lg font-bold text-center mb-1">Premium</Text>
          <Text className="text-white text-center mb-2 text-lg">
            {isMonthly ? 'S/. 20.00/mes' : 'S/. 15.00/año'}
          </Text>
          <Text className="text-gray-400 text-sm text-center mb-2">
            Incluye órdenes y cuentas ilimitadas.
          </Text>
          <View className='flex flex-col *:mb-4'>
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="check-circle" size={20} color="#FF6A00" />
              <Text className="text-gray-500 ml-2">Órdenes ilimitadas</Text>
            </View>
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="check-circle" size={20} color="#FF6A00" />
              <Text className="text-gray-500 ml-2">Cuentas ilimitadas</Text>
            </View>
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="check-circle" size={20} color="#FF6A00" />
              <Text className="text-gray-500 ml-2">Soporte 24/7</Text>
            </View>
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="check-circle" size={20} color="#FF6A00" />
              <Text className="text-gray-500 ml-2">Sin anuncios</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Beneficios */}
      <View className="mb-6">
        <Text className="text-gray-400  mb-2">Términos y Condiciones</Text>
        <View className="flex-row items-center mb-1">
          <MaterialIcons name="check-circle" size={20} color="#FF6A00" />
          <Text className="text-gray-500 ml-2">No se otorgarán reembolsos en cualquier plan elegido</Text>
        </View>
        
      </View>

      {/* Botones */}
      <TouchableOpacity className="bg-orange-500 py-4 rounded-md items-center mb-3">
        <Text className="text-white font-bold text-base">Seleccionar Plan</Text>
      </TouchableOpacity>
      <TouchableOpacity className="py-2 items-center" onPress={() => router.back()}>
        <Text className="text-orange-500 text-sm">Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PaywallScreen;


