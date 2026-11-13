import React from "react";
import { useLocalSearchParams } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";

export default function JobDetailScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const activeItem =
    tab === "home" ? "dashboard" : tab === "profile" ? "profile" : "search";
  return <AppShell roleBar="candidate" activeItem={activeItem} />;
}
