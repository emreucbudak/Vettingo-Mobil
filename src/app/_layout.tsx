import React, { useState } from "react";
import { createAppServices } from "../composition/createAppServices";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider, useApp } from "../presentation/state/AppProvider";
import { Loading } from "../presentation/components/ui";

function Routes() {
  const { session, ready } = useApp();
  if (!ready) return <Loading />;
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Protected guard={!session}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
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
  const [services] = useState(createAppServices);
  return (
    <SafeAreaProvider>
      <AppProvider services={services}>
        <Routes />
      </AppProvider>
    </SafeAreaProvider>
  );
}
