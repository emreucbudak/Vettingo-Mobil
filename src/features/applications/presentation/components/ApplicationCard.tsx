import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Application } from "../../domain/entities/Application";
import {
  Badge,
  Button,
  Card,
  Label,
  Progress,
  styles,
  Title,
} from "../../../../shared/presentation/components/ui";

export function ApplicationCard({
  item,
  compact = false,
}: {
  item: Application;
  compact?: boolean;
}) {
  const status = (
    <Badge success={item.status === "Interviewing"}>
      {item.status === "Interviewing"
        ? "Mülakat"
        : item.status === "Rejected"
          ? "Olumsuz"
          : "Başvuruldu"}
    </Badge>
  );

  return (
    <Card>
      <View style={[styles.row, { alignItems: "flex-start" }]}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Title small>{item.title}</Title>
          <Label muted>
            {item.company} · {item.location}
          </Label>
        </View>
        {status}
      </View>
      <Progress value={item.progress} />
      {!compact && item.status === "Interviewing" && (
        <Button
          label="Teknik Değerlendirmeye Git"
          secondary
          onPress={() => router.push("/candidate-assessment")}
        />
      )}
    </Card>
  );
}
