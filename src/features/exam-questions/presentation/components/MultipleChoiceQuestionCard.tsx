import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { styles } from "../../../../shared/presentation/components/ui";
import { ExamAnswerButton } from "./ExamAnswerButton";
import {
  ExamQuestionCard,
  type ExamQuestionCardProps,
} from "./ExamQuestionCard";

const optionLetters = ["A", "B", "C", "D", "E"] as const;

export function MultipleChoiceQuestionCard({
  number,
  input,
}: ExamQuestionCardProps) {
  const [answer, setAnswer] = useState<(typeof optionLetters)[number] | null>(
    null,
  );

  const formAnswer = input?.("answer");

  return (
    <ExamQuestionCard number={number} input={input}>
      <Text style={styles.label}>Seçenekler</Text>
      {optionLetters.map((letter) => {
        const { error, ...optionInput } = input?.(`options.${letter}`) ?? {};
        return (
          <View key={letter}>
            <View style={styles.row}>
              <Text style={styles.label}>{letter}</Text>
              <TextInput
                accessibilityLabel={`${letter} seçeneği`}
                style={[styles.input, questionStyles.optionInput]}
                {...optionInput}
              />
              <ExamAnswerButton
                label={`${letter} seçeneğini doğru cevap olarak işaretle`}
                checked={(formAnswer?.value ?? answer) === letter}
                onPress={() => (formAnswer?.onChangeText ?? setAnswer)(letter)}
              />
            </View>
            {error && (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            )}
          </View>
        );
      })}
    </ExamQuestionCard>
  );
}

const questionStyles = StyleSheet.create({
  optionInput: { flex: 1, minWidth: 0, minHeight: 44 },
});
