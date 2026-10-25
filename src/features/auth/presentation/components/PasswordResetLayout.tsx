import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Href, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { colors, styles } from "../../../../shared/presentation/components/ui";

export function PasswordResetLayout({
  children,
  backLabel,
  backHref,
  description,
}: React.PropsWithChildren<{
  backLabel: string;
  backHref: Href;
  description?: string;
}>) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.page} edges={["left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[resetStyles.header, { top: insets.top + 8 }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={backLabel}
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace(backHref)
            }
            style={resetStyles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.primary}
              accessible={false}
            />
          </Pressable>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={resetStyles.center}
        >
          <View style={resetStyles.content}>
            <Image
              accessibilityLabel="Vettingo logosu"
              source={require("../../../../../assets/images/vettingo_splash_logo.png")}
              resizeMode="contain"
              style={resetStyles.logo}
            />
            {description && (
              <Text style={[styles.text, resetStyles.description]}>
                {description}
              </Text>
            )}
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const resetStyles = StyleSheet.create({
  description: {
    fontWeight: "700",
    textAlign: "center",
  },
  header: { position: "absolute", left: 14, zIndex: 1 },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  content: {
    width: "100%",
    maxWidth: 460,
    padding: 20,
    gap: 18,
  },
  logo: {
    width: 252,
    height: 96,
    maxWidth: "100%",
    alignSelf: "center",
  },
});
