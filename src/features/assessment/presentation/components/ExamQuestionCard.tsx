import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import {
  Card,
  Field,
  Title,
  styles,
} from "../../../../shared/presentation/components/ui";

export function ExamQuestionCard({
  number,
  children,
}: React.PropsWithChildren<{ number: number }>) {
  return (
    <Card>
      <Title small>Soru {number}</Title>
      <Field label="Soru Metni" multiline />
      {children}
      <View style={[styles.row, questionStyles.weightRow]}>
        <Text style={styles.label}>Soru Ağırlığı</Text>
        <TextInput
          accessibilityLabel="Soru Ağırlığı"
          keyboardType="number-pad"
          style={[styles.input, questionStyles.weightInput]}
        />
      </View>
    </Card>
  );
}

const questionStyles = StyleSheet.create({
  weightRow: { alignSelf: "flex-end" },
  weightInput: {
    width: 48,
    height: 48,
    minHeight: 48,
    paddingHorizontal: 4,
    paddingVertical: 0,
    textAlign: "center",
  },
});
