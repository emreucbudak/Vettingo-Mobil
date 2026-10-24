import React, { useState } from "react";
import { Alert, Text } from "react-native";
import {
  Button,
  Field,
  styles,
} from "../../../../shared/presentation/components/ui";
import { PasswordResetLayout } from "../components/PasswordResetLayout";

export default function VerifyEmailScreen() {
  const [code, setCode] = useState("");
  const completeRegistration = () =>
    Alert.alert(
      "E-posta doğrulaması",
      "E-posta doğrulaması şu anda kullanılamıyor. Lütfen daha sonra tekrar dene.",
    );

  return (
    <PasswordResetLayout backLabel="Kayıt ekranına dön" backHref="/register">
      <Text style={[styles.text, { textAlign: "center" }]}>
        E-posta adresini doğrulaman için e-postana bir kod gönderildi. Kaydını
        tamamlamak için bu kodu aşağıya girmen gerekiyor.
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
        onSubmitEditing={completeRegistration}
      />
      <Button label="Kaydını Tamamla" onPress={completeRegistration} />
    </PasswordResetLayout>
  );
}
