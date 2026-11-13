import React from "react";
import { router } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { Button, Empty } from "../../../../shared/presentation/components/ui";
import { RequisitionCard } from "../components/RequisitionCard";
import { useApp } from "../../../../core/presentation/state/AppProvider";

export function RequisitionsScreen() {
  const { session, state } = useApp();
  const items = state.requisitions;
  if (!session) return null;
  return (
    <AppShell roleBar={session.role} activeItem="jobs" showBackButton={false}>
      <Button
        label="Yeni İlan"
        onPress={() => router.push("/new-requisition")}
      />
      {items.map((job) => (
        <RequisitionCard key={job.id} job={job} />
      ))}
      {!items.length && <Empty label="Eşleşen ilan bulunamadı." />}
    </AppShell>
  );
}
