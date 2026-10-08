import React, { useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  AppShell,
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Label,
  Progress,
  styles,
  Title,
} from "../components/ui";
import { comparisonCandidates } from "../data/demo";
import { decisionLabels } from "../domain/workflows";
import { useApp } from "../state/AppProvider";

export default function ComparisonScreen() {
  const { jobTitle } = useLocalSearchParams<{ jobTitle?: string }>();
  const { state, dispatch } = useApp();
  const [index, setIndex] = useState(0);
  const current = comparisonCandidates[index];
  const decision = state.decisions[current.id]?.action || "pending";
  return (
    <AppShell
      title="Yetenek Karşılaştırma"
      actions={
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Button
              label="Adayı Reddet"
              danger
              disabled={decision === "rejected"}
              onPress={() =>
                dispatch({
                  type: "decision",
                  candidateId: current.id,
                  action: "rejected",
                })
              }
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              label="Adayı İlerlet"
              disabled={decision === "advanced"}
              onPress={() =>
                dispatch({
                  type: "decision",
                  candidateId: current.id,
                  action: "advanced",
                })
              }
            />
          </View>
        </View>
      }
    >
      <Card>
        <Title small>{jobTitle || "Senior Frontend Engineer"}</Title>
        <Label muted>San Francisco, CA · Remote</Label>
        <Badge>Active</Badge>
      </Card>
      <View style={styles.wrap}>
        {comparisonCandidates.map((candidate, candidateIndex) => (
          <Chip
            key={candidate.id}
            label={candidate.name}
            active={candidateIndex === index}
            onPress={() => setIndex(candidateIndex)}
          />
        ))}
      </View>
      <Card>
        <View style={styles.row}>
          <Avatar initials={current.initials} />
          <View style={{ flex: 1 }}>
            <Title small>{current.name}</Title>
            <Label muted>{current.role}</Label>
          </View>
        </View>
        <Badge>{current.match}% Uyum</Badge>
        <Badge success={decision !== "rejected"}>
          {decisionLabels[decision]}
        </Badge>
        {current.skills.map((skill) => (
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
        <Title small>Öne Çıkan Güçlü Yön</Title>
        <Label>{current.summary}</Label>
        <Button
          label="Profili Gör"
          secondary
          onPress={() =>
            router.push({
              pathname: "/candidate-detail",
              params: { id: current.id },
            })
          }
        />
      </Card>
      <Card>
        <Title small>Karşılaştırma Özeti</Title>
        {comparisonCandidates.map((candidate) => (
          <View key={candidate.id} style={{ gap: 5 }}>
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <Label>{candidate.name}</Label>
              <Label muted>
                {candidate.match}% ·{" "}
                {
                  decisionLabels[
                    state.decisions[candidate.id]?.action || "pending"
                  ]
                }
              </Label>
            </View>
            <Progress value={candidate.match / 100} />
          </View>
        ))}
      </Card>
    </AppShell>
  );
}
