import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Href, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../state/AppProvider";
import { homeFor } from "../../../features/auth/presentation/navigation/routes";
import {
  colors,
  styles,
  Title,
  Loading,
} from "../../../shared/presentation/components/ui";

export function AppShell({
  children,
  title,
  actions,
}: React.PropsWithChildren<{ title?: string; actions?: React.ReactNode }>) {
  const { session, storageError } = useApp();
  const path = usePathname();
  if (!session) return <Loading />;
  const role = session.role;
  const tabs: {
    label: string;
    path: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] =
    role === "candidate"
      ? [
          {
            label: "Ana Sayfa",
            path: "/candidate-dashboard",
            icon: "home-outline",
          },
          {
            label: "Başvurularım",
            path: "/candidate-applications",
            icon: "briefcase-outline",
          },
          { label: "Arama", path: "/job-search", icon: "search-outline" },
          {
            label: "Profil",
            path: "/candidate-profile",
            icon: "person-circle-outline",
          },
        ]
      : [
          {
            label: "Ana Sayfa",
            path: `/${role}-dashboard`,
            icon: "home-outline",
          },
          {
            label: "İlanlar",
            path: `/${role}-jobs`,
            icon: "briefcase-outline",
          },
          {
            label: "Adaylar",
            path: `/${role}-candidates`,
            icon: "people-outline",
          },
          {
            label: "Profil",
            path: `/${role}-profile`,
            icon: "person-circle-outline",
          },
        ];
  const main = tabs.some((tab) => tab.path === path);
  return (
    <SafeAreaView style={styles.page} edges={["top", "bottom"]}>
      <View
        style={{
          height: 60,
          alignItems: "center",
          justifyContent: "center",
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text
          style={{
            fontSize: 23,
            fontWeight: "800",
            color: colors.primary,
            letterSpacing: -0.8,
          }}
        >
          Vettingo<Text style={{ color: colors.blue }}>.</Text>
        </Text>
        {!main && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={() =>
              router.canGoBack()
                ? router.back()
                : router.replace(homeFor(role) as Href)
            }
            style={{ position: "absolute", left: 14, padding: 10 }}
          >
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
          </Pressable>
        )}
      </View>
      {!!storageError && (
        <Text accessibilityRole="alert" style={[styles.error, { padding: 12 }]}>
          {storageError}
        </Text>
      )}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          {!!title && <Title>{title}</Title>}
          {children}
        </ScrollView>
        {actions && (
          <View
            style={{
              padding: 16,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              backgroundColor: "#fff",
              gap: 10,
            }}
          >
            {actions}
          </View>
        )}
      </KeyboardAvoidingView>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 10,
          paddingBottom: 8,
        }}
      >
        {tabs.map((tab) => {
          const active =
            path === tab.path ||
            (tab.label === "Profil" && path === "/cv-review");
          return (
            <Pressable
              key={tab.path}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: active }}
              onPress={() => router.replace(tab.path as Href)}
              style={{ flex: 1, alignItems: "center", gap: 4, minHeight: 46 }}
            >
              <Ionicons
                name={tab.icon}
                size={23}
                color={active ? colors.blue : colors.muted}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: active ? "700" : "500",
                  color: active ? colors.blue : colors.muted,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
