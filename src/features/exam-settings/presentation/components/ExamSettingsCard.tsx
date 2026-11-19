import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Field } from "../../../../shared/presentation/components/ui";

type SettingsField = "title" | "durationMinutes" | "passingScore";

export function ExamSettingsCard({
  input,
  titleMaxLength = 150,
}: {
  input?: (
    name: SettingsField,
  ) => Pick<React.ComponentProps<typeof Field>, "value" | "onChangeText">;
  titleMaxLength?: number;
}) {
  return (
    <Card>
      <Field
        label="Sınav Adı"
        placeholder="Sınav adını girin"
        maxLength={titleMaxLength}
        {...input?.("title")}
      />
      <View style={settingsStyles.row}>
        <View style={settingsStyles.column}>
          <Field
            label="Süre (Dakika)"
            keyboardType="number-pad"
            {...input?.("durationMinutes")}
          />
        </View>
        <View style={settingsStyles.column}>
          <Field
            label="Geçme Notu"
            keyboardType="number-pad"
            {...input?.("passingScore")}
          />
        </View>
      </View>
    </Card>
  );
}

const settingsStyles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  column: { flex: 1, minWidth: 0 },
});
