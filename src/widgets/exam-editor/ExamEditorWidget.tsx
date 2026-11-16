import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, styles } from "../../shared/presentation/components/ui";
import { ExamSettingsCard } from "../../features/exam-settings/presentation/components/ExamSettingsCard";
import { MultipleChoiceQuestionCard } from "../../features/exam-questions/presentation/components/MultipleChoiceQuestionCard";
import { TrueFalseQuestionCard } from "../../features/exam-questions/presentation/components/TrueFalseQuestionCard";

const questionTypes = [
  { type: "multiple-choice", label: "Çoktan Seçmeli" },
  { type: "true-false", label: "Doğru / Yanlış" },
] as const;

type QuestionType = (typeof questionTypes)[number]["type"];

export function ExamEditorWidget() {
  const [questions, setQuestions] = useState<
    { id: number; type: QuestionType }[]
  >([]);

  return (
    <>
      <ExamSettingsCard />
      <View style={examStyles.row}>
        {questionTypes.map(({ type, label }) => (
          <Pressable
            key={type}
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={() =>
              setQuestions((current) => [
                ...current,
                { id: current.length + 1, type },
              ])
            }
            style={({ pressed }) => [
              examStyles.questionType,
              pressed && examStyles.pressedType,
            ]}
          >
            <Ionicons
              name="add"
              size={18}
              color={colors.ink}
              accessible={false}
            />
            <Text style={[styles.label, examStyles.questionTypeLabel]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      {questions.map(({ id, type }) =>
        type === "multiple-choice" ? (
          <MultipleChoiceQuestionCard key={id} number={id} />
        ) : (
          <TrueFalseQuestionCard key={id} number={id} />
        ),
      )}
    </>
  );
}

const examStyles = StyleSheet.create({
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
