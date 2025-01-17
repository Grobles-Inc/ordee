import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

export default function OnboardingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
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
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to My App</Text>
      <Text style={styles.subtitle}>
        Let’s get started! Here’s how to use the app:
      </Text>

      {/* Example onboarding content */}
      <View style={styles.step}>
        <Text style={styles.stepTitle}>Step 1: Explore Features</Text>
        <Text style={styles.stepDescription}>
          Discover all the amazing features our app has to offer.
        </Text>
      </View>

      <View style={styles.step}>
        <Text style={styles.stepTitle}>Step 2: Customize Your Profile</Text>
        <Text style={styles.stepDescription}>
          Personalize your profile to make the app truly yours.
        </Text>
      </View>

      <View style={styles.step}>
        <Text style={styles.stepTitle}>Step 3: Start Using the App</Text>
        <Text style={styles.stepDescription}>
          You’re all set! Start using the app to achieve your goals.
        </Text>
      </View>

      <Button title="Get Started" onPress={handleDone} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  step: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
