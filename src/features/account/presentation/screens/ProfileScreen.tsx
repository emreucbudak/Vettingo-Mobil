import React from "react";
import { Alert, View } from "react-native";
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
  const { session, signOut } = useApp();
  if (!session) return null;
  const candidate = session.role === "candidate";
  const unavailable = (label: string) =>
    Alert.alert(
      label,
      "Bu özellik backend bağlantısı tamamlandığında kullanıma sunulacak.",
    );
  function openMenuItem(label: string) {
    if (label === "Ekip" && session?.role === "employer") {
      router.push("/employer-team" as Href);
      return;
    }
    if (label === "Bildirimler") {
      router.push("/notifications" as Href);
      return;
    }
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
          [
            { label: "Profil", path: "/candidate-profile-details" },
            { label: "Bildirimler", path: "/notifications" },
            { label: "CV", path: "/cv-review" },
          ].map(({ label, path }) => (
            <ProfileMenuRow
              key={label}
              label={label}
              onPress={() => router.push(path as Href)}
            />
          ))
        ) : (
          ["Şirket", "Bildirimler", "Scout"].map((label) => (
            <ProfileMenuRow
              key={label}
              label={label}
              onPress={() => openMenuItem(label)}
            />
          ))
        )}
      </ProfileMenuGroup>
      <ProfileMenuGroup>
        {candidate ? (
          <ProfileMenuRow
            label="Kişiselleştirilmiş İlanlar"
            onPress={() => router.push("/candidate-personalized-jobs")}
          />
        ) : session.role === "employer" ? (
          <ProfileMenuRow label="Ekip" onPress={() => openMenuItem("Ekip")} />
        ) : null}
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
