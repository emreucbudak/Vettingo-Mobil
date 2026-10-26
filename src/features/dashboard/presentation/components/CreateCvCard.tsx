import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Button,
  Card,
  colors,
} from "../../../../shared/presentation/components/ui";

export function CreateCvCard() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <Card>
      <View style={cardStyles.header}>
        <Text accessibilityRole="header" style={cardStyles.title}>
          Henüz bir CV’n yok
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="CV oluşturma kartını kapat"
          onPress={() => setDismissed(true)}
          style={({ pressed }) => [
            cardStyles.close,
            pressed && { opacity: 0.6 },
          ]}
        >
          <MaterialIcons name="close" size={22} color={colors.muted} />
        </Pressable>
      </View>
      <Text style={cardStyles.description}>
        Henüz oluşturulmuş bir CV’n yok. İş ilanlarında ve Scout ağında
        çıkabilmek ve iş arayabilmek için CV’ni oluştur.
      </Text>
      <Button label="CV oluştur" onPress={() => router.push("/cv-review")} />
    </Card>
  );
}

const cardStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    flex: 1,
    color: colors.ink,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
    paddingTop: 8,
  },
  close: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -4,
    marginRight: -8,
  },
  description: { color: colors.muted, fontSize: 14, lineHeight: 22 },
});
