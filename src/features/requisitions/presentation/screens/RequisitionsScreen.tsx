import React, { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import {
  Button,
  Chip,
  Empty,
  Search,
  styles,
} from "../../../../shared/presentation/components/ui";
import { RequisitionCard } from "../components/RequisitionCard";
import { matchesText } from "../../../../shared/domain/policies/search";
import { useApp } from "../../../../core/presentation/state/AppProvider";

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
