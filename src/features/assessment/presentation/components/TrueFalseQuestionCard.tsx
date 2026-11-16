import React, { useState } from "react";
import { Text, View } from "react-native";
import { styles } from "../../../../shared/presentation/components/ui";
import { ExamAnswerButton } from "./ExamAnswerButton";
import { ExamQuestionCard } from "./ExamQuestionCard";

const trueFalseAnswers = ["Doğru", "Yanlış"] as const;

export function TrueFalseQuestionCard({ number }: { number: number }) {
  const [answer, setAnswer] = useState<
    (typeof trueFalseAnswers)[number] | null
  >(null);

  return (
    <ExamQuestionCard number={number}>
      <Text style={styles.label}>Doğru Cevap</Text>
      <View style={styles.row}>
        {trueFalseAnswers.map((choice) => (
          <ExamAnswerButton
            key={choice}
            label={choice}
            checked={answer === choice}
            showLabel
            onPress={() => setAnswer(choice)}
          />
        ))}
      </View>
    </ExamQuestionCard>
  );
}
