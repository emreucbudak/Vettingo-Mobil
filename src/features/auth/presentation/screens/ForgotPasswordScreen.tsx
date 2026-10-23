import React, { useState } from "react";
import { router } from "expo-router";
import { Button, Field } from "../../../../shared/presentation/components/ui";
import { PasswordResetLayout } from "../components/PasswordResetLayout";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const sendCode = () => router.push("/verify-reset-code");

  return (
    <PasswordResetLayout backLabel="Giriş ekranına dön" backHref="/login">
      <Field
        label="E-posta Adresi"
        placeholder="ornek@vettingo.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={sendCode}
      />
      <Button label="Kod Gönder" onPress={sendCode} />
    </PasswordResetLayout>
  );
}
