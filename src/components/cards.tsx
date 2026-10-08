import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Application, Candidate, Job, Requisition } from "../domain/models";
import { candidateStage, stageLabels } from "../domain/workflows";
import { useApp } from "../state/AppProvider";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Label,
  Progress,
  styles,
  Title,
} from "./ui";

export function ApplicationCard({ item }: { item: Application }) {
  return (
    <Card>
      <View style={styles.row}>
        <Avatar initials={item.company.slice(0, 2).toUpperCase()} />
        <View style={{ flex: 1 }}>
          <Title small>{item.title}</Title>
          <Label muted>
            {item.company} · {item.location}
          </Label>
        </View>
      </View>
      <Badge success={item.status === "Interviewing"}>
        {item.status === "Interviewing"
          ? "Mülakat"
          : item.status === "Rejected"
            ? "Olumsuz"
            : "Başvuruldu"}
      </Badge>
      <Progress value={item.progress} />
      <Label muted>{item.next}</Label>
      {item.status === "Interviewing" && (
        <Button
          label="Teknik Değerlendirmeye Git"
          secondary
          onPress={() => router.push("/candidate-assessment")}
        />
      )}
    </Card>
  );
}
export function JobCard({ job }: { job: Job }) {
  const { state, dispatch } = useApp();
  const applied = state.applications.some((item) => item.id === job.id);
  return (
    <Card>
      <View
        style={[
          styles.row,
          { justifyContent: "space-between", alignItems: "flex-start" },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Title small>{job.title}</Title>
          <Label muted>
            {job.company} · {job.location}
          </Label>
        </View>
        <Badge>{job.match}% Uyum</Badge>
      </View>
      <Label>{job.salary}</Label>
      <View style={styles.wrap}>
        {job.tags.map((tag) => (
          <Chip key={tag} label={tag} />
        ))}
      </View>
      <Button
        label={applied ? "Başvuru Gönderildi" : "Başvur"}
        disabled={applied}
        secondary
        onPress={() => dispatch({ type: "apply", job })}
      />
    </Card>
  );
}
export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const { state } = useApp();
  const stage = candidateStage(candidate, state.decisions);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${candidate.name} profilini aç`}
      onPress={() =>
        router.push({
          pathname: "/candidate-detail",
          params: { id: candidate.id },
        })
      }
    >
      <Card>
        <View style={styles.row}>
          <Avatar initials={candidate.initials} />
          <View style={{ flex: 1 }}>
            <Title small>{candidate.name}</Title>
            <Label muted>{candidate.role}</Label>
          </View>
          <Badge>{candidate.match}%</Badge>
        </View>
        <Label muted>Başvurulan: {candidate.appliedRole}</Label>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={[styles.wrap, { flex: 1 }]}>
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
export function RequisitionCard({ job }: { job: Requisition }) {
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
        <Title small>{job.title}</Title>
        <Label muted>
          {job.locationType === "remote"
            ? "Remote"
            : `${job.office} · ${job.locationType === "hybrid" ? "Hybrid" : "On-site"}`}
        </Label>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <Badge success={job.status === "Interviewing"}>
            {job.status === "Interviewing" ? "Mülakat" : "Aday Aranıyor"}
          </Badge>
          <Label muted>
            {job.candidateLabel === "New"
              ? "Yeni adaylar"
              : `${job.candidateLabel} aday`}
          </Label>
        </View>
      </Card>
    </Pressable>
  );
}
