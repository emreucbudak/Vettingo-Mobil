import React from "react";
import { View } from "react-native";
import { Job } from "../../domain/entities/Job";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import {
  Badge,
  Button,
  Card,
  Chip,
  Label,
  styles,
  Title,
} from "../../../../shared/presentation/components/ui";

export function JobCard({ job }: { job: Job }) {
  const { state, dispatch } = useApp();
  const applied = state.applications.some((item) => item.id === job.id);
  return (
    <Card>
      <View
        style={[
          styles.row,
          { justifyContent: "space-between", alignItems: "flex-start" },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Title small>{job.title}</Title>
          <Label muted>
            {job.company} · {job.location}
          </Label>
        </View>
        <Badge>{job.match}% Uyum</Badge>
      </View>
      <Label>{job.salary}</Label>
      <View style={styles.wrap}>
        {job.tags.map((tag) => (
          <Chip key={tag} label={tag} />
        ))}
      </View>
      <Button
        label={applied ? "Başvuru Gönderildi" : "Başvur"}
        disabled={applied}
        secondary
        onPress={() => dispatch({ type: "apply", job })}
      />
    </Card>
  );
}
