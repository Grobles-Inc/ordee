import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Alert, Image } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { IconButton, Button } from "react-native-paper";

const OnboardingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const handleDone = async () => {
    try {
      await AsyncStorage.setItem("onboardingCompleted", "true");
      onComplete();
    } catch (error) {
      console.error("Error setting AsyncStorage:", error);
      Alert.alert(
        "Error",
        "Failed to save onboarding status. Please try again."
      );
    }
  };

  return (
    <Onboarding
      pages={[
        {
          backgroundColor: "#fff", // White background
          image: <Image source={require("../assets/images/onboarding.png")} />, // Image for the first screen
          title: "Bienvenido a Ordee",
          subtitle:
            "La mejor manera de gestionar tu restaurante y mejorar la experiencia de tus clientes.",
        },
        {
          backgroundColor: "#f2f2f2", // Light gray background
          image: <Image source={require("../assets/images/onboarding.png")} />, // Image for the second screen
          title: "Gestión de Menú",
          subtitle:
            "Actualiza tu menú en tiempo real y mantén a tus clientes informados.",
        },
        {
          backgroundColor: "#fff", // White background
          image: <Image source={require("../assets/images/onboarding.png")} />, // Image for the third screen
          title: "Pedidos en Línea",
          subtitle: "Acepta pedidos en línea de manera rápida y eficiente.",
        },
        {
          backgroundColor: "#f2f2f2", // Light gray background
          image: <Image source={require("../assets/images/onboarding.png")} />, // Image for the fourth screen
          title: "Análisis y Reportes",
          subtitle:
            "Obtén insights detallados sobre tus ventas y el comportamiento de tus clientes.",
        },
      ]}
      containerStyles={{
        backgroundColor: "#E5E5E5",
        padding: 16,
      }}
      bottomBarColor="#E5E5E5"
      DoneButtonComponent={(props) => (
        <Button
          mode="contained"
          buttonColor="tomato"
          style={{ marginHorizontal: 16 }}
          {...props}
        >
          Empezar
        </Button>
      )}
      NextButtonComponent={(props) => (
        <IconButton
          mode="contained"
          containerColor="tomato"
          iconColor="white"
          style={{ marginHorizontal: 16 }}
          {...props}
          icon="chevron-right"
        />
      )}
      SkipButtonComponent={(props) => (
        <Button
          mode="text"
          textColor="tomato"
          style={{ marginHorizontal: 16 }}
          {...props}
        >
          Omitir
        </Button>
      )}
      onDone={handleDone}
      onSkip={handleDone}
    />
  );
};

export default OnboardingScreen;
