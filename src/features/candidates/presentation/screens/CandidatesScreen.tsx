import React, { useState } from "react";
import { View } from "react-native";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import {
  Button,
  Chip,
  Dialog,
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
  const { state, services } = useApp();
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<Stage | "all">("all");
  const [open, setOpen] = useState(false);
  const items = services.candidates.search(query, stage, state.decisions);
  return (
    <AppShell>
      <Search
        value={query}
        onChangeText={setQuery}
        placeholder="Aday, pozisyon veya yetenek ara"
        onFilter={() => setOpen(true)}
      />
      <View style={styles.row}>
        <Label muted>{items.length} aday</Label>
        {stage !== "all" && (
          <Chip
            label={stageLabels[stage]}
            active
            onPress={() => setStage("all")}
          />
        )}
      </View>
      {items.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} />
      ))}
      {!items.length && <Empty />}
      <Dialog
        title="Adayları Filtrele"
        visible={open}
        onClose={() => setOpen(false)}
      >
        <Label muted>Başvuru aşaması</Label>
        <View style={styles.wrap}>
          <Chip
            label="Tümü"
            active={stage === "all"}
            onPress={() => setStage("all")}
          />
          {(Object.keys(stageLabels) as Stage[]).map((item) => (
            <Chip
              key={item}
              label={stageLabels[item]}
              active={stage === item}
              onPress={() => setStage(item)}
            />
          ))}
        </View>
        <Button label="Sonuçları Göster" onPress={() => setOpen(false)} />
      </Dialog>
    </AppShell>
  );
}
