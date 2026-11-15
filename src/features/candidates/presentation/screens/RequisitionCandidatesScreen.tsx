import React from "react";
import { useLocalSearchParams } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { Empty } from "../../../../shared/presentation/components/ui";
import { CandidateCard } from "../components/CandidateCard";

export default function RequisitionCandidatesScreen() {
  const { requisitionId } = useLocalSearchParams<{ requisitionId?: string }>();
  const { session, state, services } = useApp();
  if (!session) return null;

  const requisition = state.requisitions.find(({ id }) => id === requisitionId);
  if (!requisition) {
    return (
      <AppShell roleBar={session.role} activeItem="jobs" title="Adaylar">
        <Empty label="İlan bulunamadı." />
      </AppShell>
    );
  }

  const candidates = services.candidates.catalog.candidates.filter(
    (candidate) => candidate.requisitionId === requisition.id,
  );

  return (
    <AppShell roleBar={session.role} activeItem="jobs">
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} fromJobs />
      ))}
      {candidates.length === 0 && (
        <Empty label="Bu ilan için henüz aday yok." />
      )}
    </AppShell>
  );
}
