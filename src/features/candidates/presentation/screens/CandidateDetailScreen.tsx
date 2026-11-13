import React from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import {
  Avatar,
  Badge,
  Card,
  Empty,
  Label,
  styles,
  Title,
} from "../../../../shared/presentation/components/ui";
import { decisionLabels } from "../formatters/labels";
import { useApp } from "../../../../core/presentation/state/AppProvider";

export default function CandidateDetailScreen() {
  const { id, tab } = useLocalSearchParams<{ id?: string; tab?: string }>();
  const activeItem =
    tab === "home" ? "dashboard" : tab === "profile" ? "profile" : "candidates";
  const { session, state, services } = useApp();
  if (!session) return null;
  const candidate = services.candidates.find(id || "sarah-jenkins");
  if (!candidate)
    return (
      <AppShell roleBar={session.role} activeItem={activeItem}>
        <Empty label="Aday bulunamadı." />
      </AppShell>
    );
  const decision = state.decisions[candidate.id];
  const certifications = candidate.certifications ?? [];
  return (
    <AppShell roleBar={session.role} activeItem={activeItem}>
      <Card>
        <View style={styles.row}>
          <Avatar initials={candidate.initials} />
          <View style={{ flex: 1 }}>
            <Title small>{candidate.name}</Title>
          </View>
        </View>
        {decision && (
          <>
            {decision.action !== "advanced" && (
              <Badge success={decision.action !== "rejected"}>
                {decisionLabels[decision.action]}
              </Badge>
            )}
            {decision.date && (
              <Label muted>
                {new Date(decision.date).toLocaleString("tr-TR")}
              </Label>
            )}
          </>
        )}
      </Card>
      <View style={{ alignItems: "center" }}>
        <Title small>Yetenekler</Title>
      </View>
      <Card>
        {candidate.skills.map((skill) => (
          <View
            key={skill.name}
            style={[styles.row, { justifyContent: "space-between" }]}
          >
            <Label>{skill.name}</Label>
            {skill.experienceYears !== undefined && (
              <Label muted>{skill.experienceYears} yıl</Label>
            )}
          </View>
        ))}
      </Card>
      <View style={{ alignItems: "center" }}>
        <Title small>Profesyonel Deneyim</Title>
      </View>
      {candidate.experiences.map((experience, index) => (
        <Card key={index}>
          <Title small>{experience.role}</Title>
          <Label muted>
            {experience.company} · {experience.period}
          </Label>
          <Label>{experience.description}</Label>
        </Card>
      ))}
      <View style={{ alignItems: "center" }}>
        <Title small>Eğitim</Title>
      </View>
      {candidate.education.map((item, index) => (
        <Card key={index}>
          <Title small>{item.degree}</Title>
          <Label muted>
            {item.institution} · {item.period}
          </Label>
        </Card>
      ))}
      <View style={{ alignItems: "center" }}>
        <Title small>Diller</Title>
      </View>
      <Card>
        <Label muted>Dil kaydı yok.</Label>
      </Card>
      <View style={{ alignItems: "center" }}>
        <Title small>Sertifikalar</Title>
      </View>
      {certifications.length === 0 && (
        <Card>
          <Label muted>Sertifika kaydı yok.</Label>
        </Card>
      )}
      {certifications.map((item, index) => (
        <Card key={index}>
          <Title small>{item.name}</Title>
          <Label muted>
            {item.issuer} · {item.period}
          </Label>
        </Card>
      ))}
      <View style={{ alignItems: "center" }}>
        <Title small>Projeler</Title>
      </View>
      <Card>
        <Label muted>Proje kaydı yok.</Label>
      </Card>
    </AppShell>
  );
}
