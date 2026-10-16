import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "../../../../shared/presentation/components/ui";

export function ScoutEntryCard() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Scout · Yetenek Keşfet"
      onPress={() => router.push("/scout")}
      style={({ pressed }) => [scoutStyles.card, pressed && { opacity: 0.8 }]}
    >
      <Text style={scoutStyles.brand}>Scout</Text>
      <Text style={scoutStyles.title}>Ekibinin yeni yeteneklerini keşfet</Text>
      <Text style={scoutStyles.description}>
        Pozisyon ve yeteneklere göre ara, aradığın profilleri yakından tanı.
      </Text>
      <View style={scoutStyles.action}>
        <Text style={scoutStyles.actionLabel}>Yetenekleri Keşfet</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.blue} />
      </View>
    </Pressable>
  );
}

const scoutStyles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 22,
    gap: 12,
  },
  brand: { color: colors.blue, fontSize: 15, fontWeight: "700" },
  title: { color: colors.ink, fontSize: 23, lineHeight: 30, fontWeight: "700" },
  description: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  action: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionLabel: { color: colors.blue, fontSize: 15, fontWeight: "600" },
});
