import { useAuth } from "@/context";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  const { session } = useAuth();
  return session && session.user ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
