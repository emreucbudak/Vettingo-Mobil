import React from "react";
import { router } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { ProfileMenuGroup, ProfileMenuRow } from "../components/ProfileMenu";

export default function EmployerAccountPage() {
  return (
    <AppShell roleBar="employer" activeItem="profile">
      <ProfileMenuGroup>
        <ProfileMenuRow
          label="Hesap Aboneliği"
          onPress={() => router.push("/employer-plans")}
        />
      </ProfileMenuGroup>
    </AppShell>
  );
}
