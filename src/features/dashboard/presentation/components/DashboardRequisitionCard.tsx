import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Requisition } from "../../../requisitions/domain/entities/Requisition";
import {
  Badge,
  Card,
  Chip,
  colors,
  Label,
  Title,
} from "../../../../shared/presentation/components/ui";

const salaryFormatter = new Intl.NumberFormat("tr-TR");

export function DashboardRequisitionCard({ job }: { job: Requisition }) {
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
        <View style={dashboardStyles.content}>
          <View style={dashboardStyles.heading}>
            <View style={dashboardStyles.header}>
              <View style={dashboardStyles.title}>
                <Title small>{job.title}</Title>
              </View>
              <Badge success={job.status === "Interviewing"}>
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
          <Text style={dashboardStyles.detailValue}>
            <Text style={dashboardStyles.detailLabel}>Tecrübe </Text>
            {job.experienceRange
              ? `${job.experienceRange.min}–${job.experienceRange.max} yıl`
              : "Belirtilmedi"}
          </Text>
          <Text style={dashboardStyles.detailValue}>
            <Text style={dashboardStyles.detailLabel}>Maaş </Text>
            {job.salaryRange
              ? `${salaryFormatter.format(job.salaryRange.min)} – ${salaryFormatter.format(job.salaryRange.max)}`
              : "Belirtilmedi"}
          </Text>
        </View>
        {job.skills.length > 0 && (
          <View style={dashboardStyles.skillsSection}>
            <Text
              accessibilityRole="header"
              style={dashboardStyles.skillsTitle}
            >
              İstenen Yetenekler
            </Text>
            <View style={dashboardStyles.skills}>
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

const dashboardStyles = StyleSheet.create({
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
