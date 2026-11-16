import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import {
  Card,
  Field,
  colors,
  styles,
} from "../../../../shared/presentation/components/ui";
import {
  ExamQuestionCard,
  type ExamQuestionType,
} from "../components/ExamQuestionCard";

const questionTypes = [
  { type: "multiple-choice", label: "Çoktan Seçmeli" },
  { type: "true-false", label: "Doğru / Yanlış" },
] as const;

export default function CreateExamScreen() {
  const { session } = useApp();
  const [questions, setQuestions] = useState<
    { id: number; type: ExamQuestionType }[]
  >([]);
  if (!session) return null;
  return (
    <AppShell roleBar={session.role} activeItem="profile">
      <Card>
        <Field
          label="Sınav Adı"
          placeholder="Sınav adını girin"
          maxLength={150}
        />
        <View style={examStyles.row}>
          <View style={examStyles.column}>
            <Field label="Süre (Dakika)" keyboardType="number-pad" />
          </View>
          <View style={examStyles.column}>
            <Field label="Geçme Notu" keyboardType="number-pad" />
          </View>
        </View>
      </Card>
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
      {questions.map(({ id, type }) => (
        <ExamQuestionCard key={id} number={id} type={type} />
      ))}
    </AppShell>
  );
}

const examStyles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  column: { flex: 1, minWidth: 0 },
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
