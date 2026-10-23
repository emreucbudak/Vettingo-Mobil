import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Candidate } from "../../domain/entities/Candidate";
import {
  Avatar,
  Card,
  Chip,
  colors,
  Label,
  Title,
} from "../../../../shared/presentation/components/ui";

const salaryFormatter = new Intl.NumberFormat("tr-TR");

export function ScoutCandidateCard({ candidate }: { candidate: Candidate }) {
  const { tab } = useLocalSearchParams<{ tab?: string }>();

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
            </View>
          </View>
          <View style={scoutStyles.details}>
            <Label muted>
              Rol: <Text style={scoutStyles.detailValue}>{candidate.role}</Text>
            </Label>
            <Label muted>
              Tecrübe:{" "}
              <Text style={scoutStyles.detailValue}>
                {candidate.experienceYears !== undefined
                  ? `${candidate.experienceYears} yıl`
                  : "Belirtilmedi"}
              </Text>
            </Label>
            <Label muted>
              İstenen Maaş:{" "}
              <Text style={scoutStyles.detailValue}>
                {candidate.salaryExpectation !== undefined
                  ? salaryFormatter.format(candidate.salaryExpectation)
                  : "Belirtilmedi"}
              </Text>
            </Label>
          </View>
          <View style={scoutStyles.skillsSection}>
            <Text accessibilityRole="header" style={scoutStyles.skillsTitle}>
              Yetenekler
            </Text>
            <View style={scoutStyles.skills}>
              {candidate.skills.slice(0, 3).map((skill) => (
                <Chip key={skill.name} label={skill.name} />
              ))}
            </View>
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
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  identity: { flex: 1, minWidth: 0 },
  details: { gap: 8 },
  detailValue: { color: colors.ink, fontWeight: "600" },
  skillsSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    gap: 8,
  },
  skillsTitle: { color: colors.ink, fontSize: 13, fontWeight: "600" },
  skills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
