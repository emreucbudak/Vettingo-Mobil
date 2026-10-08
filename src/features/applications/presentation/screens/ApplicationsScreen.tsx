import React, { useState } from "react";
import { View } from "react-native";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import {
  Chip,
  Empty,
  Label,
  styles,
} from "../../../../shared/presentation/components/ui";
import { ApplicationCard } from "../components/ApplicationCard";
import { useApp } from "../../../../core/presentation/state/AppProvider";

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
