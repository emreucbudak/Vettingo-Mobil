import React from "react";
import { Text } from "react-native";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { Button, styles } from "../../../../shared/presentation/components/ui";
import { MultipleChoiceQuestionCard } from "../../../exam-questions/presentation/components/MultipleChoiceQuestionCard";
import { TrueFalseQuestionCard } from "../../../exam-questions/presentation/components/TrueFalseQuestionCard";
import { ExamSettingsCard } from "../../../exam-settings/presentation/components/ExamSettingsCard";
import { UpdateExamQuestionTypePicker } from "../components/UpdateExamQuestionTypePicker";
import { examTitleLimits } from "../model/examFormSchema";
import { useExamForm } from "../model/useExamForm";

export default function UpdateExamScreen() {
  const { session } = useApp();
  const {
    fields,
    addQuestion,
    input,
    validate,
    validationPassed,
    questionListError,
  } = useExamForm("update");

  if (!session) return null;

  return (
    <AppShell
      roleBar={session.role}
      activeItem="profile"
      title="Sınavı Düzenle"
      actions={<Button label="Formu Doğrula" onPress={() => void validate()} />}
    >
      {validationPassed && <Text style={styles.muted}>Form doğrulandı.</Text>}
      <ExamSettingsCard input={input} titleMaxLength={examTitleLimits.update} />
      <UpdateExamQuestionTypePicker onAddQuestion={addQuestion} />
      {questionListError && (
        <Text accessibilityRole="alert" style={styles.error}>
          {questionListError}
        </Text>
      )}
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
