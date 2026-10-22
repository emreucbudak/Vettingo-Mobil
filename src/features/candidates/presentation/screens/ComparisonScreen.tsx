import React from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import {
  Button,
  colors,
  styles,
} from "../../../../shared/presentation/components/ui";

export default function ComparisonScreen() {
  const { jobTitle } = useLocalSearchParams<{ jobTitle?: string }>();
  return (
    <AppShell>
      <View style={[styles.card, { gap: 24 }]}>
        <Text
          accessibilityRole="header"
          style={[styles.title, { textAlign: "center", width: "100%" }]}
        >
          {jobTitle || "Senior Frontend Engineer"}
        </Text>
        <View style={{ gap: 10 }}>
          <Text style={styles.label}>Rol</Text>
          <View
            style={{
              minHeight: 50,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: "#fff",
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          />
        </View>
        <View style={{ gap: 10 }}>
          <Text style={styles.label}>Tecrübe</Text>
          <View
            style={{
              minHeight: 50,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: "#fff",
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          />
        </View>
        <View style={{ gap: 10 }}>
          <Text style={styles.label}>Çalışma Tipi</Text>
          <View
            style={{
              minHeight: 50,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: "#fff",
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          />
        </View>
        <View style={{ gap: 10 }}>
          <Text style={styles.label}>Konum</Text>
          <View
            style={{
              minHeight: 50,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: "#fff",
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          />
        </View>
        <View style={{ gap: 10 }}>
          <Text style={styles.label}>Çalışma</Text>
          <View
            style={{
              minHeight: 50,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: "#fff",
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          />
        </View>
        <View style={{ gap: 10 }}>
          <Text style={styles.label}>Maaş</Text>
          <View
            style={{
              minHeight: 50,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: "#fff",
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          />
        </View>
        <View style={{ gap: 10 }}>
          <Text style={styles.label}>İstenen Yetenekler</Text>
          <ScrollView
            nestedScrollEnabled
            style={{
              height: 120,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: "#fff",
            }}
            contentContainerStyle={{
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          />
        </View>
        <View style={[styles.wrap, { gap: 12 }]}>
          <View style={{ flex: 1, minWidth: 160 }}>
            <Button
              label="İlanı Düzenle"
              secondary
              icon={
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={colors.primary}
                  accessible={false}
                />
              }
              onPress={() =>
                Alert.alert(
                  "İlanı Düzenle",
                  "Bu özellik henüz kullanıma açık değil.",
                )
              }
            />
          </View>
          <View style={{ flex: 1, minWidth: 160 }}>
            <Button
              label="İlanı Sil"
              danger
              icon={
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="#fff"
                  accessible={false}
                />
              }
              onPress={() =>
                Alert.alert(
                  "İlanı Sil",
                  "Bu özellik henüz kullanıma açık değil.",
                )
              }
            />
          </View>
        </View>
      </View>
    </AppShell>
  );
}
