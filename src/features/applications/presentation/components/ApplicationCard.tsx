import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Application } from "../../domain/entities/Application";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Label,
  Progress,
  styles,
  Title,
} from "../../../../shared/presentation/components/ui";

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
