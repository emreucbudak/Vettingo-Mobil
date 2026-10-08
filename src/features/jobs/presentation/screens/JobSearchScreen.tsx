import React, { useState } from "react";
import { Text, View } from "react-native";
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
import { JobCard } from "../components/JobCard";
import { useApp } from "../../../../core/presentation/state/AppProvider";

export function JobSearchScreen() {
  const { services } = useApp();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<string[]>(["Remote"]);
  const [filterOpen, setFilterOpen] = useState(false);
  const items = services.jobs.search(query, filters);
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
