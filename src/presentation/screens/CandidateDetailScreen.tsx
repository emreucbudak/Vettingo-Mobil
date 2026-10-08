import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  AppShell,
  Avatar,
  Badge,
  Button,
  Card,
  Dialog,
  Empty,
  Field,
  Label,
  Progress,
  styles,
  Title,
} from "../components/ui";
import { decisionLabels } from "../formatters/labels";
import { useApp } from "../state/AppProvider";

export default function CandidateDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { state, dispatch, services } = useApp();
  const candidate = services.queries.findCandidate(id || "sarah-jenkins");
  const [experienceOpen, setExperienceOpen] = useState(true);
  const [educationOpen, setEducationOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:30");
  const [error, setError] = useState("");
  if (!candidate)
    return (
      <AppShell>
        <Empty label="Aday bulunamadı." />
      </AppShell>
    );
  const decision = state.decisions[candidate.id];
  function schedule() {
    const result = services.workspace.candidates.interviewDate(date, time);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    dispatch({
      type: "decision",
      candidateId: candidate!.id,
      action: "interviewScheduled",
      date: result.date,
    });
    setScheduleOpen(false);
    setError("");
  }
  async function share() {
    try {
      await services.workspace.candidates.share(candidate!);
    } catch {
      Alert.alert("Paylaşım", "Bu cihazda paylaşım başlatılamadı.");
    }
  }
  return (
    <AppShell
      title="Aday Detayı"
      actions={
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Button
              label="Mülakat Planla"
              secondary
              onPress={() => setScheduleOpen(true)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              label="Adayı İlerlet"
              disabled={decision?.action === "advanced"}
              onPress={() =>
                dispatch({
                  type: "decision",
                  candidateId: candidate.id,
                  action: "advanced",
                })
              }
            />
          </View>
        </View>
      }
    >
      <Card>
        <View style={styles.row}>
          <Avatar initials={candidate.initials} />
          <View style={{ flex: 1 }}>
            <Title small>{candidate.name}</Title>
            <Label muted>{candidate.role}</Label>
          </View>
        </View>
        <Badge>{candidate.match}% Strong Match</Badge>
        {decision && (
          <>
            <Badge success={decision.action !== "rejected"}>
              {decisionLabels[decision.action]}
            </Badge>
            {decision.date && (
              <Label muted>
                {new Date(decision.date).toLocaleString("tr-TR")}
              </Label>
            )}
          </>
        )}
      </Card>
      <Card>
        <Title small>AI Executive Summary</Title>
        <Label>{candidate.summary}</Label>
        <Button label="Özeti Paylaş" secondary onPress={() => void share()} />
      </Card>
      <Card>
        <Title small>Rol Uyumu</Title>
        {candidate.requirements.map((requirement) => (
          <View
            key={requirement.name}
            style={[styles.row, { justifyContent: "space-between" }]}
          >
            <View style={{ flex: 1 }}>
              <Label>{requirement.name}</Label>
            </View>
            <Badge>{requirement.result}</Badge>
          </View>
        ))}
      </Card>
      <Card>
        <Title small>Yetenekler</Title>
        {candidate.skills.map((skill) => (
          <View key={skill.name} style={{ gap: 6 }}>
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <Label>{skill.name}</Label>
              <Label muted>
                {skill.level} · {Math.round(skill.score * 100)}%
              </Label>
            </View>
            <Progress value={skill.score} />
          </View>
        ))}
      </Card>
      <Button
        label={`Profesyonel Deneyim ${experienceOpen ? "−" : "+"}`}
        secondary
        onPress={() => setExperienceOpen(!experienceOpen)}
      />
      {experienceOpen &&
        candidate.experiences.map((experience, index) => (
          <Card key={index}>
            <Title small>{experience.role}</Title>
            <Label muted>
              {experience.company} · {experience.period}
            </Label>
            <Label>{experience.description}</Label>
          </Card>
        ))}
      <Button
        label={`Eğitim ve Sertifikalar ${educationOpen ? "−" : "+"}`}
        secondary
        onPress={() => setEducationOpen(!educationOpen)}
      />
      {educationOpen &&
        candidate.education.map((item, index) => (
          <Card key={index}>
            <Title small>{item.degree}</Title>
            <Label muted>
              {item.institution} · {item.period}
            </Label>
          </Card>
        ))}
      <Dialog
        title="Mülakat Planla"
        visible={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
      >
        <Label>{candidate.name}</Label>
        <Label muted>
          Bu görüşme cihazda saklanır. Takvim daveti gönderilmez.
        </Label>
        <Field
          label="Tarih (YYYY-AA-GG)"
          value={date}
          onChangeText={setDate}
          placeholder="2026-10-15"
        />
        <Field
          label="Saat (SS:DD)"
          value={time}
          onChangeText={setTime}
          placeholder="10:30"
        />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Button label="Görüşmeyi Kaydet" onPress={schedule} />
      </Dialog>
    </AppShell>
  );
}
