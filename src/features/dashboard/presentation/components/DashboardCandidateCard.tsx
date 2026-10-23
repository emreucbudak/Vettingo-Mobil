import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Candidate } from "../../../candidates/domain/entities/Candidate";
import { candidateStage } from "../../../candidates/domain/policies/stage";
import { stageLabels } from "../../../candidates/presentation/formatters/labels";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import {
  Avatar,
  Badge,
  Card,
  Chip,
  Label,
  Title,
} from "../../../../shared/presentation/components/ui";

export function DashboardCandidateCard({
  candidate,
}: {
  candidate: Candidate;
}) {
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
        <View style={dashboardStyles.header}>
          <Avatar initials={candidate.initials} />
          <View style={dashboardStyles.identity}>
            <Title small>{candidate.name}</Title>
            <Label muted>{candidate.role}</Label>
          </View>
          <Badge>{candidate.match}%</Badge>
        </View>
        <Label muted>Başvurulan: {candidate.appliedRole}</Label>
        <View style={dashboardStyles.footer}>
          <View style={dashboardStyles.skills}>
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

const dashboardStyles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  identity: { flex: 1 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  skills: { flexDirection: "row", flexWrap: "wrap", gap: 8, flex: 1 },
});
