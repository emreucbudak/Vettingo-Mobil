import React, { useState } from "react";
import { Text, View } from "react-native";
import { styles } from "../../../../shared/presentation/components/ui";
import { ExamAnswerButton } from "./ExamAnswerButton";
import {
  ExamQuestionCard,
  type ExamQuestionCardProps,
} from "./ExamQuestionCard";

const trueFalseAnswers = ["Doğru", "Yanlış"] as const;

export function TrueFalseQuestionCard({
  number,
  input,
}: ExamQuestionCardProps) {
  const [answer, setAnswer] = useState<
    (typeof trueFalseAnswers)[number] | null
  >(null);

  const formAnswer = input?.("answer");

  return (
    <ExamQuestionCard number={number} input={input}>
      <Text style={styles.label}>Doğru Cevap</Text>
      <View style={styles.row}>
        {trueFalseAnswers.map((choice) => (
          <ExamAnswerButton
            key={choice}
            label={choice}
            checked={(formAnswer?.value ?? answer) === choice}
            showLabel
            onPress={() => (formAnswer?.onChangeText ?? setAnswer)(choice)}
          />
        ))}
      </View>
    </ExamQuestionCard>
  );
}
