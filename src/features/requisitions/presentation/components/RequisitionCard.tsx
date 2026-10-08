import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Requisition } from "../../domain/entities/Requisition";
import {
  Badge,
  Card,
  Label,
  styles,
  Title,
} from "../../../../shared/presentation/components/ui";

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
