import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { JobSummary } from "../../domain/entities/Job";
import {
  Card,
  Chip,
  colors,
  Label,
  Title,
} from "../../../../shared/presentation/components/ui";

export function JobSearchCard({
  job,
  onPress,
  onCompanyPress,
}: {
  job: JobSummary;
  onPress: () => void;
  onCompanyPress?: () => void;
}) {
  const locationType =
    job.locationType ??
    (/remote/i.test(job.location)
      ? "remote"
      : /hybrid/i.test(job.location)
        ? "hybrid"
        : "onsite");
  const skills = job.skills ?? job.tags;

  return (
    <Card>
      <View style={cardStyles.heading}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${job.title} ilan detayını aç`}
          onPress={onPress}
        >
          <Title small>{job.title}</Title>
        </Pressable>
        <View style={cardStyles.companyRow}>
          {!!job.company &&
            (onCompanyPress ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${job.company} şirket detayını aç`}
                onPress={onCompanyPress}
                hitSlop={6}
              >
                <Text style={cardStyles.companyLink}>{job.company}</Text>
              </Pressable>
            ) : (
              <Label muted>{job.company}</Label>
            ))}
          <Label muted>
            {job.company ? "· " : ""}
            {job.office ?? job.location}
          </Label>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${job.title} ilan bilgilerini aç`}
        onPress={onPress}
        style={cardStyles.content}
      >
        <View style={cardStyles.content}>
          <Label muted>
            {job.employmentType ?? "Tam Zamanlı"} ·{" "}
            {locationType === "remote"
              ? "Remote"
              : locationType === "hybrid"
                ? "Hybrid"
                : "On-site"}
          </Label>
          <Text style={cardStyles.detailValue}>
            <Text style={cardStyles.detailLabel}>Tecrübe </Text>
            {job.experienceRange
              ? `${job.experienceRange.min}–${job.experienceRange.max} yıl`
              : job.experienceYears !== undefined
                ? `${job.experienceYears}+ yıl`
                : "Belirtilmedi"}
          </Text>
          <Text style={cardStyles.detailValue}>
            <Text style={cardStyles.detailLabel}>Maaş </Text>
            {job.salary}
          </Text>
        </View>
        {skills.length > 0 && (
          <View style={cardStyles.skillsSection}>
            <Text accessibilityRole="header" style={cardStyles.skillsTitle}>
              İstenen Yetenekler
            </Text>
            <View style={cardStyles.skills}>
              {skills.map((skill) => (
                <Chip key={skill} label={skill} />
              ))}
            </View>
          </View>
        )}
      </Pressable>
    </Card>
  );
}

const cardStyles = StyleSheet.create({
  content: { gap: 8 },
  heading: { gap: 4 },
  companyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
  },
  companyLink: {
    color: colors.blue,
    fontSize: 13,
    lineHeight: 20,
  },
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
