import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Requisition } from "../../../requisitions/domain/entities/Requisition";
import {
  Badge,
  Card,
  Label,
  Title,
} from "../../../../shared/presentation/components/ui";

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
        <Title small>{job.title}</Title>
        <Label muted>
          {job.locationType === "remote"
            ? "Remote"
            : `${job.office} · ${job.locationType === "hybrid" ? "Hybrid" : "On-site"}`}
        </Label>
        <View style={dashboardStyles.footer}>
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

const dashboardStyles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
});
