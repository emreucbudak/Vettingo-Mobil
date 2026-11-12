import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import {
  Button,
  colors,
  styles,
} from "../../../../shared/presentation/components/ui";

export default function EmployerTeamScreen() {
  return (
    <AppShell>
      <View style={teamStyles.addButton}>
        <Button
          label="Çalışan Ekle"
          onPress={() => router.push("/employer-team-add" as Href)}
        />
      </View>
      <View role="table" accessibilityLabel="Ekip" style={teamStyles.table}>
        <View role="row" style={[teamStyles.row, teamStyles.header]}>
          <Text role="columnheader" style={[styles.label, teamStyles.name]}>
            İsim Soyisim
          </Text>
          <Text role="columnheader" style={[styles.label, teamStyles.date]}>
            Eklenme Tarihi
          </Text>
          <Text
            role="columnheader"
            style={[styles.label, teamStyles.actionHeader]}
          >
            İşlem Yap
          </Text>
        </View>
        <View role="row" style={teamStyles.row}>
          <Text role="cell" style={[styles.muted, teamStyles.name]}>
            Çalışan kaydı yok.
          </Text>
          <Text role="cell" style={[styles.muted, teamStyles.date]}>
            —
          </Text>
          <View role="cell" style={teamStyles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Düzenle"
              onPress={() => router.push("/employer-team-edit" as Href)}
              style={teamStyles.iconButton}
            >
              <Ionicons name="pencil-outline" size={20} color={colors.primary} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sil"
              accessibilityState={{ disabled: true }}
              disabled
              style={teamStyles.iconButton}
            >
              <Ionicons name="trash-outline" size={20} color={colors.muted} />
            </Pressable>
          </View>
        </View>
      </View>
    </AppShell>
  );
}

const teamStyles = StyleSheet.create({
  addButton: { alignSelf: "flex-end" },
  table: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  header: {
    minHeight: 48,
    paddingVertical: 8,
    backgroundColor: colors.soft,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  name: { flex: 1.2 },
  date: { flex: 1 },
  actionHeader: { width: 88, textAlign: "center" },
  actions: { flexDirection: "row", width: 88 },
  iconButton: {
    width: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
