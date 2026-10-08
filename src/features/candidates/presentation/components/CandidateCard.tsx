import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Candidate } from "../../domain/entities/Candidate";
import { candidateStage } from "../../domain/policies/stage";
import { stageLabels } from "../formatters/labels";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import {
  Avatar,
  Badge,
  Card,
  Chip,
  Label,
  styles,
  Title,
} from "../../../../shared/presentation/components/ui";

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const { state } = useApp();
  const stage = candidateStage(candidate, state.decisions);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${candidate.name} profilini aç`}
      onPress={() =>
        router.push({
          pathname: "/candidate-detail",
          params: { id: candidate.id },
        })
      }
    >
      <Card>
        <View style={styles.row}>
          <Avatar initials={candidate.initials} />
          <View style={{ flex: 1 }}>
            <Title small>{candidate.name}</Title>
            <Label muted>{candidate.role}</Label>
          </View>
          <Badge>{candidate.match}%</Badge>
        </View>
        <Label muted>Başvurulan: {candidate.appliedRole}</Label>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={[styles.wrap, { flex: 1 }]}>
            {candidate.skills.slice(0, 3).map((skill) => (
              <Chip key={skill.name} label={skill.name} />
            ))}
          </View>
          <Badge success={stage === "offer"}>{stageLabels[stage]}</Badge>
        </View>
      </Card>
    </Pressable>
  );
}
