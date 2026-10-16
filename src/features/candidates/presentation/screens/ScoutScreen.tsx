import React, { useState } from "react";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import {
  Empty,
  Label,
  Search,
} from "../../../../shared/presentation/components/ui";
import { CandidateCard } from "../components/CandidateCard";

export default function ScoutScreen() {
  const { state, services } = useApp();
  const [query, setQuery] = useState("");
  const candidates = services.candidates.search(query, "all", state.decisions);

  return (
    <AppShell title="Scout">
      <Label muted>Ekibin için yeni yetenekleri keşfet.</Label>
      <Search
        value={query}
        onChangeText={setQuery}
        placeholder="İsim, pozisyon veya yetenek ara"
      />
      <Label muted>{candidates.length} yetenek</Label>
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} />
      ))}
      {!candidates.length && (
        <Empty label="Aramana uygun yetenek bulunamadı." />
      )}
    </AppShell>
  );
}
