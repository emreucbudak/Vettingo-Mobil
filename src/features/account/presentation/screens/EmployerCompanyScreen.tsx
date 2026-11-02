import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { colors } from "../../../../shared/presentation/components/ui";
import { CompanyDetails } from "../components/CompanyDetails";

export default function EmployerCompanyScreen() {
  const { session } = useApp();

  return (
    <AppShell
      headerRight={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Şirket bilgilerini düzenle"
          onPress={() => router.push("/employer-company-edit")}
          style={{ padding: 10, minWidth: 44, minHeight: 44 }}
        >
          <Ionicons
            name="pencil-outline"
            size={22}
            color={colors.primary}
            accessible={false}
          />
        </Pressable>
      }
    >
      <CompanyDetails companyName={session?.company ?? ""} />
    </AppShell>
  );
}
