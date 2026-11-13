import React, { useState } from "react";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { Button, Field } from "../../../../shared/presentation/components/ui";

export default function EmployerTeamAddScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AppShell roleBar="employer" activeItem="profile" centerContent>
      <Field
        label="İsim"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
        autoCorrect={false}
      />
      <Field
        label="Soyisim"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
        autoCorrect={false}
      />
      <Field
        label="E-posta"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Field
        label="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
      />
      <Button label="Çalışan Ekle" disabled onPress={() => undefined} />
    </AppShell>
  );
}
