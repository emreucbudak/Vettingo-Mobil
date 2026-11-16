import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Field } from "../../../../shared/presentation/components/ui";

export function ExamSettingsCard() {
  return (
    <Card>
      <Field
        label="Sınav Adı"
        placeholder="Sınav adını girin"
        maxLength={150}
      />
      <View style={settingsStyles.row}>
        <View style={settingsStyles.column}>
          <Field label="Süre (Dakika)" keyboardType="number-pad" />
        </View>
        <View style={settingsStyles.column}>
          <Field label="Geçme Notu" keyboardType="number-pad" />
        </View>
      </View>
    </Card>
  );
}

const settingsStyles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  column: { flex: 1, minWidth: 0 },
});
