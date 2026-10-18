import React, { useState } from "react";
import { ScrollView } from "react-native";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import {
  Chip,
  Empty,
  Label,
  Search,
  styles,
} from "../../../../shared/presentation/components/ui";
import { CandidateCard } from "../components/CandidateCard";
import { stageLabels } from "../formatters/labels";
import { Stage } from "../../domain/entities/Candidate";
import { useApp } from "../../../../core/presentation/state/AppProvider";

export function CandidatesScreen() {
  const { session, state, services } = useApp();
  const employer = session?.role === "employer";
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<Stage | "all">("all");
  const items = services.candidates.search(query, stage, state.decisions);
  return (
    <AppShell>
      <Search
        value={query}
        onChangeText={setQuery}
        placeholder={employer ? "Aday ara" : "Aday, pozisyon veya yetenek ara"}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.row}
      >
        <Chip
          label="Tümü"
          active={stage === "all"}
          onPress={() => setStage("all")}
        />
        {(["assessment", "interview", "offer", "rejected"] as const).map(
          (item) => (
            <Chip
              key={item}
              label={stageLabels[item]}
              active={stage === item}
              onPress={() => setStage(item)}
            />
          ),
        )}
      </ScrollView>
      <Label muted>{items.length} aday</Label>
      {items.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} />
      ))}
      {!items.length && <Empty />}
    </AppShell>
  );
}
