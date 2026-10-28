import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Candidate } from "../../domain/entities/Candidate";
import { candidateStage } from "../../domain/policies/stage";
import { stageLabels } from "../formatters/labels";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import {
  Badge,
  Card,
  Chip,
  colors,
  Label,
  styles,
  Title,
} from "../../../../shared/presentation/components/ui";

const salaryFormatter = new Intl.NumberFormat("tr-TR");

export function CandidateCard({
  candidate,
  neutralStageBadge = false,
}: {
  candidate: Candidate;
  neutralStageBadge?: boolean;
}) {
  const { state, session } = useApp();
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
        <View style={[styles.row, { alignItems: "flex-start" }]}>
          <View style={{ flex: 1, minWidth: 0, alignSelf: "center" }}>
            <Title small>{candidate.name}</Title>
          </View>
          <Badge
            success={
              !neutralStageBadge &&
              session?.role !== "employer" &&
              stage === "offer"
            }
          >
            {stageLabels[stage]}
          </Badge>
        </View>
        <View style={cardStyles.details}>
          <Label muted>Başvurulan: {candidate.appliedRole}</Label>
          <Label muted>
            Tecrübe:{" "}
            <Text style={cardStyles.detailValue}>
              {candidate.experienceYears !== undefined
                ? `${candidate.experienceYears} yıl`
                : "Belirtilmedi"}
            </Text>
          </Label>
          <Label muted>
            Maaş:{" "}
            <Text style={cardStyles.detailValue}>
              {candidate.salaryExpectation !== undefined
                ? salaryFormatter.format(candidate.salaryExpectation)
                : "Belirtilmedi"}
            </Text>
          </Label>
        </View>
        <View style={cardStyles.skillsSection}>
          <Text accessibilityRole="header" style={cardStyles.skillsTitle}>
            Yetenekler
          </Text>
          <View style={styles.wrap}>
            {candidate.skills.slice(0, 3).map((skill) => (
              <Chip key={skill.name} label={skill.name} />
            ))}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const cardStyles = StyleSheet.create({
  details: { gap: 8 },
  detailValue: { color: colors.ink, fontWeight: "600" },
  skillsSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    gap: 8,
  },
  skillsTitle: { color: colors.ink, fontSize: 13, fontWeight: "600" },
});
