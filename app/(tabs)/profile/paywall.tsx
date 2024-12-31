import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import { handleIntegrationMP } from '@/utils/integrationmp';
import { supabase } from '@/utils/supabase';
import { openBrowserAsync } from 'expo-web-browser';
import { useAuth } from '@/context';

const PaywallScreen = () => {
  interface Plan {
    id: number;
    name: string;
    price: number;
    billing: string;
  }

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isMonthly, setIsMonthly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const router = useRouter();
  const { profile, session } = useAuth();
  useEffect(() => {
    const fetchPlans = async () => {
      const { data: plans, error } = await supabase
        .from('plans')
        .select('*')
        .order('id', { ascending: true });
      if (error) {
        console.log('Error fetching plans:', error.message);
      } else {
        setPlans(plans);
      }
    };
    fetchPlans();
  }, []);

  const handleBuy = async () => {
    if (selectedPlan) {
      console.log('Comprar plan:', selectedPlan);
      const planData = await handleIntegrationMP(selectedPlan, profile.tenants?.name, profile?.name, session?.user.email);
      openBrowserAsync(planData);
    } else {
      console.log('No plan selected');
    }
  };
  const isDisabled = selectedPlan?.id === profile.tenants?.id_plan;
  return (
    <ScrollView className="flex-1 p-5" contentContainerStyle={{ paddingBottom: 30 }}>
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
        {plans
          .filter(plan => plan.billing === (isMonthly ? 'monthly' : 'annual'))
          .map(plan => (
            <TouchableOpacity
              key={plan.id}
              className={`p-4 border rounded-lg ${selectedPlan?.id === plan.id ? 'border-orange-500' : 'border-gray-400'}`}
              onPress={() => setSelectedPlan(plan)}
            >
              <Text className="text-orange-500 text-lg font-bold text-center mb-1">
                {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
              </Text>
              <Text className="text-white text-center mb-2 text-lg">
                S/. {plan.price.toFixed(2)} {isMonthly ? '/mes' : '/año'}
              </Text>
              <Text className="text-gray-400 text-sm text-center mb-2">
                {plan.name === 'free'
                  ? 'Incluye órdenes limitadas.'
                  : plan.name === 'essential'
                    ? 'Incluye órdenes ilimitadas.'
                    : 'Incluye órdenes y cuentas ilimitadas.'}
              </Text>
              <View>
                <View className="flex-row items-center mb-1">
                  <MaterialIcons name="check-circle" size={20} color="#FF6A00" />
                  <Text className="text-gray-500 ml-2">
                    {plan.name === 'free' ? 'Órdenes limitadas' : 'Órdenes ilimitadas'}
                  </Text>
                </View>
                {plan.name === 'pro' && (
                  <View className="flex-row items-center mb-1">
                    <MaterialIcons name="check-circle" size={20} color="#FF6A00" />
                    <Text className="text-gray-500 ml-2">Cuentas ilimitadas</Text>
                  </View>
                )}
                <View className="flex-row items-center mb-1">
                  <MaterialIcons name="check-circle" size={20} color="#FF6A00" />
                  <Text className="text-gray-500 ml-2">Soporte 24/7</Text>
                </View>
                <View className="flex-row items-center mb-1">
                  <MaterialIcons name="check-circle" size={20} color="#FF6A00" />
                  <Text className="text-gray-500 ml-2">Sin anuncios</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </View>

      {/* Beneficios */}
      <View className="mb-6">
        <Text className="text-gray-400 mb-2">Términos y Condiciones</Text>
        <View className="flex-row items-center mb-1">
          <MaterialIcons name="check-circle" size={20} color="#FF6A00" />
          <Text className="text-gray-500 ml-2">
            No se otorgarán reembolsos en cualquier plan elegido
          </Text>
        </View>
      </View>

      {/* Botones */}
      <TouchableOpacity
        className={`py-4 rounded-md items-center mb-3 ${isDisabled ? 'bg-gray-400' : 'bg-orange-500'}`}
        onPress={handleBuy}
        disabled={isDisabled}
      >
        <Text className="!text-white font-bold text-base">
          Seleccionar Plan
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="py-2 items-center" onPress={() => router.back()}>
        <Text className="text-orange-500 text-sm">Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PaywallScreen;
