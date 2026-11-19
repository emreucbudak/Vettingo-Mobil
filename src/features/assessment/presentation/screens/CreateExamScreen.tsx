import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  get,
  useFieldArray,
  useForm,
  useWatch,
  type FieldPathByValue,
} from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { colors, styles } from "../../../../shared/presentation/components/ui";
import { ExamSettingsCard } from "../../../exam-settings/presentation/components/ExamSettingsCard";
import { MultipleChoiceQuestionCard } from "../../../exam-questions/presentation/components/MultipleChoiceQuestionCard";
import { TrueFalseQuestionCard } from "../../../exam-questions/presentation/components/TrueFalseQuestionCard";

const questionTypes = [
  { type: "multiple-choice", label: "Çoktan Seçmeli" },
  { type: "true-false", label: "Doğru / Yanlış" },
] as const;

type QuestionType = (typeof questionTypes)[number]["type"];

type ExamFormValues = {
  title: string;
  durationMinutes: string;
  passingScore: string;
  questions: {
    type: QuestionType;
    questionText: string;
    weight: string;
    answer: string;
    options: Record<string, string>;
  }[];
};

export default function CreateExamScreen() {
  const { session } = useApp();
  const { control, setValue } = useForm<ExamFormValues>({
    defaultValues: {
      title: "",
      durationMinutes: "",
      passingScore: "",
      questions: [],
    },
  });
  const { fields, append } = useFieldArray({ control, name: "questions" });
  const values = useWatch({ control });

  if (!session) return null;

  function input(name: FieldPathByValue<ExamFormValues, string>) {
    return {
      value: get(values, name, "") as string,
      onChangeText: (value: string) =>
        setValue(name, value, { shouldDirty: true }),
    };
  }

  function addQuestion(type: QuestionType) {
    append(
      { type, questionText: "", weight: "", answer: "", options: {} },
      { shouldFocus: false },
    );
  }

  return (
    <AppShell roleBar={session.role} activeItem="profile">
      <ExamSettingsCard input={input} />
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
