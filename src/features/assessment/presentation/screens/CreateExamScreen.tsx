import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import {
  Button,
  colors,
  styles,
} from "../../../../shared/presentation/components/ui";
import { ExamSettingsCard } from "../../../exam-settings/presentation/components/ExamSettingsCard";
import { MultipleChoiceQuestionCard } from "../../../exam-questions/presentation/components/MultipleChoiceQuestionCard";
import { TrueFalseQuestionCard } from "../../../exam-questions/presentation/components/TrueFalseQuestionCard";
import { examTitleLimits } from "../model/examFormSchema";
import { useExamForm } from "../model/useExamForm";

const questionTypes = [
  { type: "multiple-choice", label: "Çoktan Seçmeli" },
  { type: "true-false", label: "Doğru / Yanlış" },
] as const;

export default function CreateExamScreen() {
  const { session } = useApp();
  const { fields, addQuestion, input, validate, validation } =
    useExamForm("create");

  if (!session) return null;

  return (
    <AppShell
      roleBar={session.role}
      activeItem="profile"
      actions={<Button label="Formu Doğrula" onPress={() => void validate()} />}
    >
      {validation && (
        <Text
          accessibilityRole={validation.error ? "alert" : undefined}
          style={validation.error ? styles.error : styles.muted}
        >
          {validation.message}
        </Text>
      )}
      <ExamSettingsCard input={input} titleMaxLength={examTitleLimits.create} />
      <View style={examStyles.row}>
        {questionTypes.map(({ type, label }) => (
          <Pressable
            key={type}
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={() => addQuestion(type)}
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
      {fields.map(({ id, type }, index) => {
        const QuestionCard =
          type === "multiple-choice"
            ? MultipleChoiceQuestionCard
            : TrueFalseQuestionCard;
        return (
          <QuestionCard
            key={id}
            number={index + 1}
            input={(name) => input(`questions.${index}.${name}`)}
          />
        );
      })}
    </AppShell>
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
