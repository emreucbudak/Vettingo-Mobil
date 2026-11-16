import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { styles } from "../../../../shared/presentation/components/ui";
import { ExamAnswerButton } from "./ExamAnswerButton";
import { ExamQuestionCard } from "./ExamQuestionCard";

const optionLetters = ["A", "B", "C", "D", "E"] as const;

export function MultipleChoiceQuestionCard({ number }: { number: number }) {
  const [answer, setAnswer] = useState<(typeof optionLetters)[number] | null>(
    null,
  );

  return (
    <ExamQuestionCard number={number}>
      <Text style={styles.label}>Seçenekler</Text>
      {optionLetters.map((letter) => (
        <View key={letter} style={styles.row}>
          <Text style={styles.label}>{letter}</Text>
          <TextInput
            accessibilityLabel={`${letter} seçeneği`}
            style={[styles.input, questionStyles.optionInput]}
          />
          <ExamAnswerButton
            label={`${letter} seçeneğini doğru cevap olarak işaretle`}
            checked={answer === letter}
            onPress={() => setAnswer(letter)}
          />
        </View>
      ))}
    </ExamQuestionCard>
  );
}

const questionStyles = StyleSheet.create({
  optionInput: { flex: 1, minWidth: 0, minHeight: 44 },
});
