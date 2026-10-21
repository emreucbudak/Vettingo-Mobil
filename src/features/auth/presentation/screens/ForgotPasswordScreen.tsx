import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Button,
  colors,
  Field,
  styles,
} from "../../../../shared/presentation/components/ui";
import { authenticationSchema } from "../../domain/policies/validation";

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function sendCode() {
    const result = authenticationSchema.shape.email.safeParse(email);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError("");
    Alert.alert(
      "Kod Gönder",
      "Kod gönderimi API bağlantısı tamamlandığında kullanıma sunulacak.",
    );
  }

  return (
    <SafeAreaView style={styles.page} edges={["left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[resetStyles.header, { top: insets.top + 8 }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Giriş ekranına dön"
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/login")
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
        <View style={resetStyles.center}>
          <View style={resetStyles.content}>
            <Image
              accessibilityLabel="Vettingo logosu"
              source={require("../../../../../assets/images/vettingo_splash_logo.png")}
              resizeMode="contain"
              style={resetStyles.logo}
            />
            <Field
              label="E-posta Adresi"
              placeholder="ornek@vettingo.com"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setError("");
              }}
              error={error}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={sendCode}
            />
            <Button label="Kod Gönder" onPress={sendCode} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const resetStyles = StyleSheet.create({
  header: { position: "absolute", left: 14, zIndex: 1 },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
