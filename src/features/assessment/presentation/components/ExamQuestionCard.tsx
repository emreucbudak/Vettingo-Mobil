import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  Card,
  Field,
  Title,
  colors,
  styles,
} from "../../../../shared/presentation/components/ui";

export type ExamQuestionType = "multiple-choice" | "true-false";

const optionLetters = ["A", "B", "C", "D", "E"];
const trueFalseAnswers = ["Doğru", "Yanlış"];

function AnswerButton({
  label,
  checked,
  showLabel = false,
  onPress,
}: {
  label: string;
  checked: boolean;
  showLabel?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      onPress={onPress}
      style={[
        questionStyles.answer,
        showLabel && questionStyles.labeledAnswer,
        checked && questionStyles.checkedAnswer,
      ]}
    >
      {showLabel && <Text style={styles.label}>{label}</Text>}
      <Ionicons
        name={checked ? "checkmark-circle" : "ellipse-outline"}
        size={20}
        color={checked ? colors.green : colors.muted}
        accessible={false}
      />
    </Pressable>
  );
}

export function ExamQuestionCard({
  number,
  type,
}: {
  number: number;
  type: ExamQuestionType;
}) {
  const [answer, setAnswer] = useState<string | null>(null);
  const multipleChoice = type === "multiple-choice";

  return (
    <Card>
      <Title small>Soru {number}</Title>
      <Field label="Soru Metni" multiline />
      <Text style={styles.label}>
        {multipleChoice ? "Seçenekler" : "Doğru Cevap"}
      </Text>
      {multipleChoice ? (
        optionLetters.map((letter) => (
          <View key={letter} style={styles.row}>
            <Text style={styles.label}>{letter}</Text>
            <TextInput
              accessibilityLabel={`${letter} seçeneği`}
              style={[styles.input, questionStyles.optionInput]}
            />
            <AnswerButton
              label={`${letter} seçeneğini doğru cevap olarak işaretle`}
              checked={answer === letter}
              onPress={() => setAnswer(letter)}
            />
          </View>
        ))
      ) : (
        <View style={styles.row}>
          {trueFalseAnswers.map((choice) => (
            <AnswerButton
              key={choice}
              label={choice}
              checked={answer === choice}
              showLabel
              onPress={() => setAnswer(choice)}
            />
          ))}
        </View>
      )}
    </Card>
  );
}

const questionStyles = StyleSheet.create({
  optionInput: { flex: 1, minWidth: 0, minHeight: 44 },
  answer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
    minHeight: 44,
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#fff",
  },
  labeledAnswer: { flex: 1, paddingHorizontal: 8 },
  checkedAnswer: { borderColor: colors.green, backgroundColor: colors.greenBg },
});
