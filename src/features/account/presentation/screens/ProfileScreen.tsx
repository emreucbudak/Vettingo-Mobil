import React from "react";
import { Alert, Pressable, Switch, View } from "react-native";
import { router } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import {
  Avatar,
  Button,
  Card,
  Label,
  styles,
  Title,
} from "../../../../shared/presentation/components/ui";
import { roleLabels } from "../../../auth/presentation/formatters/labels";
import { useApp } from "../../../../core/presentation/state/AppProvider";

export default function ProfileScreen() {
  const { session, state, dispatch, signOut } = useApp();
  if (!session) return null;
  const candidate = session.role === "candidate";
  const unavailable = (label: string) =>
    Alert.alert(
      label,
      "Bu özellik backend bağlantısı tamamlandığında kullanıma sunulacak.",
    );
  async function logout() {
    try {
      await signOut();
      router.replace("/login");
    } catch {
      Alert.alert(
        "Çıkış Yap",
        "Yerel oturum silinemedi. Lütfen tekrar deneyin.",
      );
    }
  }
  return (
    <AppShell>
      <Card>
        <View style={styles.row}>
          <Avatar initials={session.name.slice(0, 2).toUpperCase()} />
          <View style={{ flex: 1 }}>
            <Title small>{session.name}</Title>
            <Label muted>{session.email}</Label>
            <Label muted>
              {roleLabels[session.role]}
              {session.company ? ` · ${session.company}` : ""}
            </Label>
          </View>
        </View>
      </Card>
      {candidate ? (
        <Button
          label="Profil ve CV Düzenle"
          secondary
          onPress={() => router.push("/cv-review")}
        />
      ) : (
        <Card>
          {["Şirket Profili", "Ekip ve Yetkiler", "İşe Alım Tercihleri"].map(
            (label) => (
              <Pressable
                key={label}
                accessibilityRole="button"
                onPress={() => unavailable(label)}
                style={{ paddingVertical: 12 }}
              >
                <Label>{label} ›</Label>
              </Pressable>
            ),
          )}
        </Card>
      )}
      <Card>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <Label>Bildirim Tercihi</Label>
          <Switch
            accessibilityLabel="Bildirim tercihi"
            value={state.notifications}
            onValueChange={(enabled) =>
              dispatch({ type: "notifications", enabled })
            }
          />
        </View>
        <Label muted>
          Tercihin cihazda saklanır. Push bildirim servisi henüz bağlı değildir.
        </Label>
        {["Güvenlik", "Yardım Merkezi"].map((label) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            onPress={() => unavailable(label)}
            style={{ paddingVertical: 12 }}
          >
            <Label>{label} ›</Label>
          </Pressable>
        ))}
      </Card>
      <Button label="Çıkış Yap" danger onPress={() => void logout()} />
    </AppShell>
  );
}
