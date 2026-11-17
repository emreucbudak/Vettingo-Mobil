import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, styles } from "../../../../shared/presentation/components/ui";

const questionTypes = [
  { type: "multiple-choice", label: "Çoktan Seçmeli" },
  { type: "true-false", label: "Doğru / Yanlış" },
] as const;

export type UpdateExamQuestionType = (typeof questionTypes)[number]["type"];

export function UpdateExamQuestionTypePicker({
  onAddQuestion,
}: {
  onAddQuestion: (type: UpdateExamQuestionType) => void;
}) {
  return (
    <View style={pickerStyles.row}>
      {questionTypes.map(({ type, label }) => (
        <Pressable
          key={type}
          accessibilityRole="button"
          accessibilityLabel={label}
          onPress={() => onAddQuestion(type)}
          style={({ pressed }) => [
            pickerStyles.questionType,
            pressed && pickerStyles.pressedType,
          ]}
        >
          <Ionicons name="add" size={18} color={colors.ink} accessible={false} />
          <Text style={[styles.label, pickerStyles.questionTypeLabel]}>
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const pickerStyles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  questionType: {
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    padding: 10,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.border,
    backgroundColor: "#fff",
  },
  pressedType: { backgroundColor: colors.soft },
  questionTypeLabel: { flexShrink: 1, textAlign: "center" },
});
