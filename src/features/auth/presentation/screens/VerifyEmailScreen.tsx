import React, { useState } from "react";
import { Text } from "react-native";
import {
  Button,
  Field,
  styles,
} from "../../../../shared/presentation/components/ui";
import { PasswordResetLayout } from "../components/PasswordResetLayout";
import { useAuthenticationCompletion } from "../hooks/useAuthenticationCompletion";

export default function VerifyEmailScreen() {
  const [code, setCode] = useState("");
  const { submitCode, loading, error } = useAuthenticationCompletion(true);

  return (
    <PasswordResetLayout
      backLabel="Kayıt ekranına dön"
      backHref="/register"
      description="E-posta adresini doğrulaman için e-postana bir kod gönderildi. Kaydını tamamlamak için bu kodu aşağıya girmen gerekiyor."
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
        onSubmitEditing={submitCode}
      />
      {error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
      <Button label="Kaydını Tamamla" onPress={submitCode} loading={loading} />
    </PasswordResetLayout>
  );
}
