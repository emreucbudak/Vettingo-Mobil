import React, { useState } from "react";
import { router } from "expo-router";
import { Button, Field } from "../../../../shared/presentation/components/ui";
import { PasswordResetLayout } from "../components/PasswordResetLayout";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const changePassword = () => router.replace("/login");

  return (
    <PasswordResetLayout
      backLabel="Kod ekranına dön"
      backHref="/verify-reset-code"
    >
      <Field
        label="Yeni Şifre"
        placeholder="Yeni şifrenizi girin"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        autoCorrect={false}
      />
      <Field
        label="Yeni Şifre Tekrar"
        placeholder="Yeni şifrenizi tekrar girin"
        value={confirmation}
        onChangeText={setConfirmation}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={changePassword}
      />
      <Button label="Şifreni Değiştir" onPress={changePassword} />
    </PasswordResetLayout>
  );
}
