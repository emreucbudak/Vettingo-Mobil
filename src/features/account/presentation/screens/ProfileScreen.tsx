import React from "react";
import { Alert, Switch, View } from "react-native";
import { router, Href } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import {
  Avatar,
  Card,
  Label,
  styles,
  Title,
} from "../../../../shared/presentation/components/ui";
import { roleLabels } from "../../../auth/presentation/formatters/labels";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { ProfileMenuGroup, ProfileMenuRow } from "../components/ProfileMenu";

const accountPages: Record<string, string> = {
  Şirket: "company",
  Güvenlik: "security",
  "Yardım Merkezi": "help",
};

export default function ProfileScreen() {
  const { session, state, dispatch, signOut } = useApp();
  if (!session) return null;
  const candidate = session.role === "candidate";
  const unavailable = (label: string) =>
    Alert.alert(
      label,
      "Bu özellik backend bağlantısı tamamlandığında kullanıma sunulacak.",
    );
  function openMenuItem(label: string) {
    if (label === "Scout") {
      router.push({ pathname: "/scout", params: { tab: "profile" } });
      return;
    }
    const page = accountPages[label];
    if (session?.role === "candidate" && (page === "security" || page === "help")) {
      router.push(`/candidate-${page}` as Href);
      return;
    }
    if ((session?.role === "employer" || session?.role === "hr") && page) {
      router.push(`/${session.role}-${page}` as Href);
      return;
    }
    unavailable(label);
  }
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
      <ProfileMenuGroup>
        {candidate ? (
          ["Profil", "CV"].map((label) => (
            <ProfileMenuRow
              key={label}
              label={label}
              onPress={() =>
                router.push(
                  (label === "Profil"
                    ? "/candidate-profile-details"
                    : "/cv-review") as Href,
                )
              }
            />
          ))
        ) : (
          ["Şirket", "Ekip ve Yetkiler", "Scout"].map((label) => (
            <ProfileMenuRow
              key={label}
              label={label}
              onPress={() => openMenuItem(label)}
            />
          ))
        )}
      </ProfileMenuGroup>
      <ProfileMenuGroup>
        <ProfileMenuRow
          label="Bildirim Tercihi"
          accessory={
            <Switch
              accessibilityLabel="Bildirim tercihi"
              value={state.notifications}
              onValueChange={(enabled) =>
                dispatch({ type: "notifications", enabled })
              }
            />
          }
        />
        {["Güvenlik", "Yardım Merkezi"].map((label) => (
          <ProfileMenuRow
            key={label}
            label={label}
            onPress={() => openMenuItem(label)}
          />
        ))}
      </ProfileMenuGroup>
      <ProfileMenuGroup>
        <ProfileMenuRow
          label="Çıkış Yap"
          danger
          onPress={() => void logout()}
        />
      </ProfileMenuGroup>
    </AppShell>
  );
}
