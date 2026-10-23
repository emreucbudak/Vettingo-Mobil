import React, { useEffect, useMemo } from "react";
import { createAppServices } from "../composition/createAppServices";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider, useApp } from "../core/presentation/state/AppProvider";
import { homeFor } from "../features/auth/presentation/navigation/routes";

void SplashScreen.preventAutoHideAsync();

function Routes() {
  const { session } = useApp();
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Protected
          guard={!session}
          redirectTo={session ? homeFor(session.role) : "/login"}
        >
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="forgot-password" />
        </Stack.Protected>
        <Stack.Protected guard={session?.role === "candidate"}>
          <Stack.Screen name="(candidate)" />
        </Stack.Protected>
        <Stack.Protected guard={session?.role === "employer"}>
          <Stack.Screen name="(employer)" />
        </Stack.Protected>
        <Stack.Protected guard={session?.role === "hr"}>
          <Stack.Screen name="(hr)" />
        </Stack.Protected>
        <Stack.Protected
          guard={session?.role === "employer" || session?.role === "hr"}
        >
          <Stack.Screen name="(hiring)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
export default function RootLayout() {
  // Fast Refresh must rebuild services when their composition changes.
  const services = useMemo(() => createAppServices(), []);
  return (
    <SafeAreaProvider>
      <AppProvider services={services}>
        <Routes />
      </AppProvider>
    </SafeAreaProvider>
  );
}
