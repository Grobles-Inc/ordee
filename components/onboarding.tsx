import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Alert, Image, useColorScheme } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { IconButton, Button } from "react-native-paper";

const OnboardingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const colorScheme = useColorScheme();
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
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          image: (
            <Image
              style={{ width: 400, height: 400 }}
              source={require("../assets/images/onboarding.webp")}
            />
          ), // Image for the first screen
          title: "Bienvenido a Ordee",
          subtitle:
            "La mejor manera de gestionar tu restaurante y mejorar la experiencia de tus clientes.",
        },
        {
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          image: (
            <Image
              style={{ width: 400, height: 400 }}
              source={require("../assets/images/onboarding6.webp")}
            />
          ), // Image for the second screen
          title: "Registra tus pedidos",
          subtitle:
            "Toma nota de tus pedidos y gestiona tus clientes de manera eficiente.",
        },
        {
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          image: (
            <Image
              style={{ width: 400, height: 400 }}
              source={require("../assets/images/onboarding2.webp")}
            />
          ), // Image for the second screen
          title: "Gestión de Usuarios",
          subtitle:
            "Gestion de usuarios, roles y permisos para una gestión eficiente para tus empleados.",
        },
        {
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          image: (
            <Image
              style={{ width: 400, height: 400 }}
              source={require("../assets/images/onboarding7.webp")}
            />
          ), // Image for the second screen
          title: "Gestión de Menú",
          subtitle:
            "Actualiza tu menú en tiempo real y mantén a tus clientes informados.",
        },
        {
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          image: (
            <Image
              style={{ width: 400, height: 400 }}
              source={require("../assets/images/onboarding5.webp")}
            />
          ), // Image for the fourth screen
          title: "Generador de Comprobantes",
          subtitle:
            "Imprime tus facturas y recibos de tus servicios con solo un clic.",
        },
        {
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          image: (
            <Image
              style={{ width: 400, height: 400 }}
              source={require("../assets/images/onboarding4.webp")}
            />
          ), // Image for the fourth screen
          title: "Análisis y Reportes",
          subtitle:
            "Obtén insights detallados sobre tus ventas y más funcionalidades para hacer tu management simple.",
        },
      ]}
      containerStyles={{
        backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
        padding: 16,
      }}
      bottomBarColor={colorScheme === "dark" ? "#000" : "#fff"}
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
