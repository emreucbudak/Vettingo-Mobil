import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import {
  Button,
  colors,
  styles,
} from "../../../../shared/presentation/components/ui";

export default function ExamsScreen() {
  const { session } = useApp();
  if (!session) return null;
  return (
    <AppShell roleBar={session.role} activeItem="profile">
      <View style={examStyles.addButton}>
        <Button
          label="Yeni Sınav"
          onPress={() => router.push("/create-exam")}
        />
      </View>
      <View role="table" accessibilityLabel="Sınavlar" style={examStyles.table}>
        <View role="row" style={[examStyles.row, examStyles.header]}>
          <Text role="columnheader" style={[styles.label, examStyles.name]}>
            Sınav Adı
          </Text>
          <Text role="columnheader" style={[styles.label, examStyles.date]}>
            Oluşturulma Tarihi
          </Text>
          <Text
            role="columnheader"
            style={[styles.label, examStyles.actionHeader]}
          >
            İşlem
          </Text>
        </View>
        <View role="row" style={examStyles.row}>
          <Text role="cell" style={[styles.muted, examStyles.name]}>
            Sınav kaydı yok.
          </Text>
          <Text role="cell" style={[styles.muted, examStyles.date]}>
            —
          </Text>
          <View role="cell" style={examStyles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sınavı Düzenle"
              disabled
              style={examStyles.iconButton}
            >
              <MaterialIcons name="edit" size={20} color={colors.muted} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sınavı Sil"
              disabled
              style={examStyles.iconButton}
            >
              <Ionicons name="trash-outline" size={20} color={colors.muted} />
            </Pressable>
          </View>
        </View>
      </View>
    </AppShell>
  );
}

const examStyles = StyleSheet.create({
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
