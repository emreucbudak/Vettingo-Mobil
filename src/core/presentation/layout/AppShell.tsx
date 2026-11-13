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
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../state/AppProvider";
import type { Role } from "../../../features/auth/domain/entities/Session";
import { homeFor } from "../../../features/auth/presentation/navigation/routes";
import { barItemsByRole, type BarItemId } from "./barItems";
import {
  colors,
  styles,
  Title,
} from "../../../shared/presentation/components/ui";

export function AppShell({
  children,
  title,
  actions,
  headerRight,
  roleBar,
  activeItem,
  centerContent = false,
  showBackButton = true,
}: React.PropsWithChildren<{
  title?: string;
  actions?: React.ReactNode;
  headerRight?: React.ReactNode;
  roleBar: Role;
  activeItem: BarItemId;
  centerContent?: boolean;
  showBackButton?: boolean;
}>) {
  const { storageError } = useApp();
  return (
    <SafeAreaView style={styles.page} edges={["top"]}>
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
          Vettingo
        </Text>
        {showBackButton && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={() =>
              router.canGoBack()
                ? router.back()
                : router.replace(homeFor(roleBar))
            }
            style={{ position: "absolute", left: 14, padding: 10 }}
          >
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
          </Pressable>
        )}
        {headerRight && (
          <View style={{ position: "absolute", right: 14 }}>{headerRight}</View>
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
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.content,
            centerContent && {
              flexGrow: 1,
              justifyContent: "center",
              paddingBottom: styles.content.padding,
            },
          ]}
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
      <SafeAreaView
        edges={{ bottom: "maximum" }}
        style={{
          flexDirection: "row",
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 10,
          paddingBottom: 8,
        }}
      >
        {barItemsByRole[roleBar].map((tab) => {
          const active = tab.id === activeItem;
          return (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: active }}
              onPress={() => router.replace(tab.href)}
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
      </SafeAreaView>
    </SafeAreaView>
  );
}
