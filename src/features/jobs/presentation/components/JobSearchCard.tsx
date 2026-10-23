import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Job } from "../../domain/entities/Job";
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
}: {
  job: Job;
  onPress: () => void;
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
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${job.title} ilan detayını aç`}
      onPress={onPress}
    >
      <Card>
        <View style={cardStyles.content}>
          <View style={cardStyles.heading}>
            <Title small>{job.title}</Title>
            <Label muted>
              {job.company} · {job.office ?? job.location}
            </Label>
          </View>
          <Label muted>
            Tam Zamanlı ·{" "}
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
      </Card>
    </Pressable>
  );
}

const cardStyles = StyleSheet.create({
  content: { gap: 8 },
  heading: { gap: 4 },
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
