import React, { useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import {
  AppShell,
  Button,
  Chip,
  Dialog,
  Empty,
  Label,
  Search,
  styles,
} from "../components/ui";
import {
  ApplicationCard,
  CandidateCard,
  JobCard,
  RequisitionCard,
} from "../components/cards";
import { matchesText } from "../../domain/policies/recruitment";
import { stageLabels } from "../formatters/labels";
import { Stage } from "../../domain/entities/models";
import { useApp } from "../state/AppProvider";

export function ApplicationsScreen() {
  const { state } = useApp();
  const [filter, setFilter] = useState("Tümü");
  const items = state.applications.filter(
    (item) => filter === "Tümü" || item.status === filter,
  );
  return (
    <AppShell title="Başvurularım">
      <View style={styles.wrap}>
        {[
          ["Tümü", "Tümü"],
          ["Applied", "Başvuruldu"],
          ["Interviewing", "Mülakat"],
          ["Rejected", "Olumsuz"],
        ].map(([value, label]) => (
          <Chip
            key={value}
            label={label}
            active={filter === value}
            onPress={() => setFilter(value)}
          />
        ))}
      </View>
      <Label muted>{items.length} başvuru</Label>
      {items.map((item) => (
        <ApplicationCard key={item.id} item={item} />
      ))}
      {!items.length && <Empty label="Bu durumda bir başvurunuz yok." />}
    </AppShell>
  );
}
export function JobSearchScreen() {
  const { services } = useApp();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<string[]>(["Remote"]);
  const [filterOpen, setFilterOpen] = useState(false);
  const items = services.queries.searchJobs(query, filters);
  return (
    <AppShell>
      <Search
        value={query}
        onChangeText={setQuery}
        placeholder="Pozisyon veya şirket ara"
        onFilter={() => setFilterOpen(true)}
      />
      <View style={styles.wrap}>
        {filters.map((filter) => (
          <Chip
            key={filter}
            label={`${filter} ×`}
            active
            onPress={() =>
              setFilters(filters.filter((item) => item !== filter))
            }
          />
        ))}
      </View>
      <View style={styles.row}>
        <Text style={styles.heading}>Önerilen Eşleşmeler</Text>
        <View style={{ flex: 1 }} />
        <Label muted>{items.length} sonuç</Label>
      </View>
      {items.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
      {!items.length && <Empty />}
      <Dialog
        title="İşleri Filtrele"
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
      >
        <View style={styles.wrap}>
          {["Remote", "Series B+", "Fintech", "$200k+"].map((filter) => (
            <Chip
              key={filter}
              label={filter}
              active={filters.includes(filter)}
              onPress={() =>
                setFilters(
                  filters.includes(filter)
                    ? filters.filter((item) => item !== filter)
                    : [...filters, filter],
                )
              }
            />
          ))}
        </View>
        <Button
          label="Filtreleri Temizle"
          secondary
          onPress={() => setFilters([])}
        />
        <Button label="Sonuçları Göster" onPress={() => setFilterOpen(false)} />
      </Dialog>
    </AppShell>
  );
}
export function CandidatesScreen() {
  const { state, services } = useApp();
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<Stage | "all">("all");
  const [open, setOpen] = useState(false);
  const items = services.queries.searchCandidates(
    query,
    stage,
    state.decisions,
  );
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
export function RequisitionsScreen() {
  const { state, session } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const items = state.requisitions.filter(
    (job) =>
      matchesText(query, [job.title, job.office, job.locationType]) &&
      (filter === "all" || job.status === filter),
  );
  return (
    <AppShell
      actions={
        <Button
          label="Yeni İlan"
          onPress={() => router.push("/new-requisition")}
        />
      }
    >
      <Search
        value={query}
        onChangeText={setQuery}
        placeholder="Pozisyon veya konum ara"
      />
      {session?.role === "hr" && (
        <View style={styles.wrap}>
          {[
            ["all", "Tümü"],
            ["Sourcing", "Aday Aranıyor"],
            ["Interviewing", "Mülakat"],
          ].map(([value, label]) => (
            <Chip
              key={value}
              label={label}
              active={filter === value}
              onPress={() => setFilter(value)}
            />
          ))}
        </View>
      )}
      {items.map((job) => (
        <RequisitionCard key={job.id} job={job} />
      ))}
      {!items.length && <Empty label="Eşleşen ilan bulunamadı." />}
    </AppShell>
  );
}
