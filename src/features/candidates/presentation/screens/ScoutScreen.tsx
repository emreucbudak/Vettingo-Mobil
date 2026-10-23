import React, { useState } from "react";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { Empty, Search } from "../../../../shared/presentation/components/ui";
import { ScoutCandidateCard } from "../components/ScoutCandidateCard";
import { ScoutFiltersDialog } from "../components/ScoutFiltersDialog";
import { CandidateFilter } from "../../domain/policies/filters";

export default function ScoutScreen() {
  const { state, services } = useApp();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<CandidateFilter[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const candidates = services.candidates.search(
    query,
    "all",
    state.decisions,
    filters,
  );

  return (
    <AppShell>
      <Search
        value={query}
        onChangeText={setQuery}
        placeholder="Yetenek Ara"
        onFilter={() => setFilterOpen(true)}
      />
      {candidates.map((candidate) => (
        <ScoutCandidateCard key={candidate.id} candidate={candidate} />
      ))}
      {!candidates.length && (
        <Empty label="Aramana uygun yetenek bulunamadı." />
      )}
      <ScoutFiltersDialog
        visible={filterOpen}
        filters={filters}
        onChange={setFilters}
        onClose={() => setFilterOpen(false)}
      />
    </AppShell>
  );
}
