import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Requisition } from "../../domain/entities/Requisition";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import {
  Badge,
  Card,
  Chip,
  colors,
  Label,
  Title,
} from "../../../../shared/presentation/components/ui";

const salaryFormatter = new Intl.NumberFormat("tr-TR");

export function RequisitionCard({ job }: { job: Requisition }) {
  const { session } = useApp();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${job.title} adaylarını karşılaştır`}
      onPress={() =>
        router.push({
          pathname: "/talent-comparison",
          params: { jobTitle: job.title },
        })
      }
    >
      <Card>
        <View style={cardStyles.content}>
          <View style={cardStyles.heading}>
            <View style={cardStyles.header}>
              <View style={cardStyles.title}>
                <Title small>{job.title}</Title>
              </View>
              <Badge
                success={
                  session?.role !== "employer" && job.status === "Interviewing"
                }
              >
                {job.status === "Interviewing" ? "Mülakat" : "Aday Aranıyor"}
              </Badge>
            </View>
            {!!job.office.trim() && <Label muted>{job.office}</Label>}
          </View>
          <Label muted>
            Tam Zamanlı ·{" "}
            {job.locationType === "remote"
              ? "Remote"
              : job.locationType === "hybrid"
                ? "Hybrid"
                : "On-site"}
          </Label>
          <Text style={cardStyles.detailValue}>
            <Text style={cardStyles.detailLabel}>Tecrübe </Text>
            {job.experienceRange
              ? `${job.experienceRange.min}–${job.experienceRange.max} yıl`
              : "Belirtilmedi"}
          </Text>
          <Text style={cardStyles.detailValue}>
            <Text style={cardStyles.detailLabel}>Maaş </Text>
            {job.salaryRange
              ? `${salaryFormatter.format(job.salaryRange.min)} – ${salaryFormatter.format(job.salaryRange.max)}`
              : "Belirtilmedi"}
          </Text>
        </View>
        {job.skills.length > 0 && (
          <View style={cardStyles.skillsSection}>
            <Text accessibilityRole="header" style={cardStyles.skillsTitle}>
              İstenen Yetenekler
            </Text>
            <View style={cardStyles.skills}>
              {job.skills.map((skill) => (
                <Chip key={skill} label={skill} />
              ))}
            </View>
          </View>
        )}
      </Card>
    </Pressable>
  );
}

const cardStyles = StyleSheet.create({
  content: { gap: 8 },
  heading: { gap: 4 },
  header: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  title: { flex: 1, minWidth: 0 },
  detailValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 22,
  },
  detailLabel: { color: colors.muted, fontSize: 13, fontWeight: "400" },
  skillsSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    gap: 8,
  },
  skillsTitle: { color: colors.ink, fontSize: 13, fontWeight: "600" },
  skills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
