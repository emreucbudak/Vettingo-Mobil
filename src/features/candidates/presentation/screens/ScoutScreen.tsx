import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { Empty, Search } from "../../../../shared/presentation/components/ui";
import { ScoutFiltersDialog } from "../components/ScoutFiltersDialog";
import { CandidateFilter } from "../../domain/policies/filters";

export default function ScoutScreen() {
  const { session } = useApp();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<CandidateFilter[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  if (!session) return null;
  return (
    <AppShell
      roleBar={session.role}
      activeItem="scout"
      showBackButton={tab === "home"}
    >
      <Search
        value={query}
        onChangeText={setQuery}
        placeholder="Yetenek Ara"
        onFilter={() => setFilterOpen(true)}
      />
      <Empty label="Henüz gösterilecek yetenek yok." />
      <ScoutFiltersDialog
        visible={filterOpen}
        filters={filters}
        onChange={setFilters}
        onClose={() => setFilterOpen(false)}
      />
    </AppShell>
  );
}
