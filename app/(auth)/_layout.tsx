import { useAuth } from "@/context";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native-paper";

export default function AuthLayout() {
  const { session, loading } = useAuth();
  if (loading) return <ActivityIndicator color="tomato" />;
  return session && session.user ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
