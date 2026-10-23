import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Candidate } from "../../domain/entities/Candidate";
import { candidateStage } from "../../domain/policies/stage";
import { stageLabels } from "../formatters/labels";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import {
  Avatar,
  Badge,
  Card,
  Chip,
  colors,
  Label,
  Title,
} from "../../../../shared/presentation/components/ui";

export function ScoutCandidateCard({ candidate }: { candidate: Candidate }) {
  const { state } = useApp();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const stage = candidateStage(candidate, state.decisions);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${candidate.name} profilini aç`}
      onPress={() =>
        router.push({
          pathname: "/candidate-detail",
          params: {
            id: candidate.id,
            ...(tab === "profile" ? { tab } : {}),
          },
        })
      }
    >
      <Card>
        <View style={scoutStyles.content}>
          <View style={scoutStyles.header}>
            <Avatar initials={candidate.initials} />
            <View style={scoutStyles.identity}>
              <Title small>{candidate.name}</Title>
              <Label muted>{candidate.role}</Label>
            </View>
            <Badge success={stage === "offer"}>{stageLabels[stage]}</Badge>
          </View>
          <Label muted>
            Başvurulan Pozisyon:{" "}
            <Text style={scoutStyles.appliedRole}>{candidate.appliedRole}</Text>
          </Label>
          <View style={scoutStyles.skills}>
            {candidate.skills.slice(0, 3).map((skill) => (
              <Chip key={skill.name} label={skill.name} />
            ))}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const scoutStyles = StyleSheet.create({
  content: {
    minHeight: 164,
    justifyContent: "space-between",
    gap: 20,
  },
  header: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  identity: { flex: 1, minWidth: 0 },
  appliedRole: { color: colors.ink, fontWeight: "600" },
  skills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
