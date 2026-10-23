import React, { useState } from "react";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import {
  Empty,
  Label,
  Search,
} from "../../../../shared/presentation/components/ui";
import { ScoutCandidateCard } from "../components/ScoutCandidateCard";

export default function ScoutScreen() {
  const { state, services } = useApp();
  const [query, setQuery] = useState("");
  const candidates = services.candidates.search(query, "all", state.decisions);

  return (
    <AppShell>
      <Search value={query} onChangeText={setQuery} placeholder="Yetenek Ara" />
      <Label muted>{candidates.length} yetenek</Label>
      {candidates.map((candidate) => (
        <ScoutCandidateCard key={candidate.id} candidate={candidate} />
      ))}
      {!candidates.length && (
        <Empty label="Aramana uygun yetenek bulunamadı." />
      )}
    </AppShell>
  );
}
