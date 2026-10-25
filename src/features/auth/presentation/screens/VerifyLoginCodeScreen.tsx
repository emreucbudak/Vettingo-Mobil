import React, { useState } from "react";
import { Text } from "react-native";
import {
  Button,
  Field,
  styles,
} from "../../../../shared/presentation/components/ui";
import { PasswordResetLayout } from "../components/PasswordResetLayout";
import { useAuthenticationCompletion } from "../hooks/useAuthenticationCompletion";

export default function VerifyLoginCodeScreen() {
  const [code, setCode] = useState("");
  const { submitCode, loading, error } = useAuthenticationCompletion(false);

  return (
    <PasswordResetLayout
      backLabel="Giriş ekranına dön"
      backHref="/login"
      description="Giriş yapman için e-postana bir kod gönderdik. Bu kodu aşağıya girmen gerekiyor."
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
      <Button label="Giriş Kodunu Gir" onPress={submitCode} loading={loading} />
    </PasswordResetLayout>
  );
}
