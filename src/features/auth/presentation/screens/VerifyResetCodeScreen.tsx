import React, { useState } from "react";
import { router } from "expo-router";
import { Button, Field } from "../../../../shared/presentation/components/ui";
import { PasswordResetLayout } from "../components/PasswordResetLayout";

export default function VerifyResetCodeScreen() {
  const [code, setCode] = useState("");
  const enterCode = () => router.push("/reset-password");

  return (
    <PasswordResetLayout
      backLabel="E-posta ekranına dön"
      backHref="/forgot-password"
      description="Şifreni sıfırlaman için e-postana bir kod gönderdik. Yeni şifreni belirlemek için bu kodu aşağıya girmen gerekiyor."
    >
      <Field
        label="Kod"
        placeholder="Kodu girin"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        autoCapitalize="none"
        autoComplete="one-time-code"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={enterCode}
      />
      <Button label="Kod Gir" onPress={enterCode} />
    </PasswordResetLayout>
  );
}
