import React, { useState } from "react";
import { Alert, Text } from "react-native";
import {
  Button,
  Field,
  styles,
} from "../../../../shared/presentation/components/ui";
import { PasswordResetLayout } from "../components/PasswordResetLayout";

export default function VerifyLoginCodeScreen() {
  const [code, setCode] = useState("");
  const submitCode = () =>
    Alert.alert(
      "Giriş kodu doğrulaması",
      "Giriş kodu doğrulaması şu anda kullanılamıyor. Lütfen daha sonra tekrar dene.",
    );

  return (
    <PasswordResetLayout backLabel="Giriş ekranına dön" backHref="/login">
      <Text style={[styles.text, { textAlign: "center" }]}>
        Giriş yapman için e-postana bir kod gönderdik. Bu kodu aşağıya girmen
        gerekiyor.
      </Text>
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
      <Button label="Giriş Kodunu Gir" onPress={submitCode} />
    </PasswordResetLayout>
  );
}
