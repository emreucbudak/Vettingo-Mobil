import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { colors, Field } from "../../../../shared/presentation/components/ui";

export default function CandidateProfileDetailsScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <AppShell>
      <View style={profileStyles.photoSection}>
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel="Profil fotoğrafı alanı"
          style={profileStyles.photoCircle}
        >
          <Ionicons
            name="person-outline"
            size={48}
            color={colors.muted}
            accessible={false}
          />
        </View>
      </View>
      <Field
        label="Ad"
        placeholder="Adınız"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
        autoComplete="given-name"
        autoCorrect={false}
      />
      <Field
        label="Soyad"
        placeholder="Soyadınız"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
        autoComplete="family-name"
        autoCorrect={false}
      />
    </AppShell>
  );
}

const profileStyles = StyleSheet.create({
  photoSection: {
    alignItems: "center",
    paddingVertical: 12,
  },
  photoCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.soft,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
