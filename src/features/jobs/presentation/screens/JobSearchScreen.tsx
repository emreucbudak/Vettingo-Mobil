import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import {
  Chip,
  colors,
  Dialog,
  Empty,
  Label,
  Search,
  styles,
} from "../../../../shared/presentation/components/ui";
import { JobCard } from "../components/JobCard";
import { useApp } from "../../../../core/presentation/state/AppProvider";

const filterGroups = [
  {
    title: "Çalışma Tercihi",
    options: [
      { value: "Onsite", label: "Ofisten" },
      { value: "Hybrid", label: "Hybrid" },
      { value: "Remote", label: "Uzaktan" },
    ],
  },
  {
    title: "Maaş",
    options: [
      { value: "salary:0:50000", label: "0–50.000" },
      { value: "salary:50000:100000", label: "50.000–100.000" },
      { value: "salary:100000:Infinity", label: "100.000+" },
    ],
  },
  {
    title: "Deneyim",
    options: [
      { value: "experience:0:5", label: "0–5 yıl" },
      { value: "experience:5:10", label: "5–10 yıl" },
      { value: "experience:10:Infinity", label: "10+ yıl" },
    ],
  },
];

export function JobSearchScreen() {
  const { services } = useApp();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<string[]>(["Remote"]);
  const [filterOpen, setFilterOpen] = useState(false);
  const items = services.jobs.search(query, filters);
  function toggleFilter(value: string, options: { value: string }[]) {
    setFilters((current) => {
      const remaining = current.filter(
        (filter) => !options.some((option) => option.value === filter),
      );
      return current.includes(value) ? remaining : [...remaining, value];
    });
  }
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
            label={`${filterGroups.flatMap((group) => group.options).find((option) => option.value === filter)?.label ?? filter} ×`}
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
        title=""
        closeIcon
        headerBottomPadding={0}
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
      >
        {filterGroups.map((group) => (
          <View key={group.title} style={{ gap: 12 }}>
            <Text style={styles.heading}>{group.title}</Text>
            <View style={styles.wrap}>
              {group.options.map((option) => {
                const selected = filters.includes(option.value);
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityLabel={option.label}
                    accessibilityState={{ selected }}
                    onPress={() => toggleFilter(option.value, group.options)}
                    style={{
                      width: group.options.length === 3 ? "30%" : "47%",
                      flexGrow: 1,
                      minHeight: 48,
                      paddingHorizontal: 8,
                      paddingVertical: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: selected ? colors.primary : colors.border,
                      backgroundColor: selected ? colors.primary : colors.soft,
                    }}
                  >
                    <Text
                      style={{
                        color: selected ? "#fff" : colors.ink,
                        fontSize: 13,
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </Dialog>
    </AppShell>
  );
}
