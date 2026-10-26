import React from "react";
import { StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import {
  Button,
  Card,
  colors,
} from "../../../../shared/presentation/components/ui";

export function CreateCvCard() {
  return (
    <Card>
      <Text accessibilityRole="header" style={cardStyles.title}>
        Henüz bir CV’n yok
      </Text>
      <Text style={cardStyles.description}>
        Henüz oluşturulmuş bir CV’n yok. İş ilanlarında ve Scout ağında
        çıkabilmek ve iş arayabilmek için CV’ni oluştur.
      </Text>
      <Button label="CV oluştur" onPress={() => router.push("/cv-review")} />
    </Card>
  );
}

const cardStyles = StyleSheet.create({
  title: {
    color: colors.ink,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
  },
  description: { color: colors.muted, fontSize: 14, lineHeight: 22 },
});
