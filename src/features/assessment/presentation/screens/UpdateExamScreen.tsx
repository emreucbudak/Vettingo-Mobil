import React, { useState } from "react";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { MultipleChoiceQuestionCard } from "../../../exam-questions/presentation/components/MultipleChoiceQuestionCard";
import { TrueFalseQuestionCard } from "../../../exam-questions/presentation/components/TrueFalseQuestionCard";
import { ExamSettingsCard } from "../../../exam-settings/presentation/components/ExamSettingsCard";
import {
  UpdateExamQuestionTypePicker,
  type UpdateExamQuestionType,
} from "../components/UpdateExamQuestionTypePicker";

export default function UpdateExamScreen() {
  const { session } = useApp();
  const [questions, setQuestions] = useState<
    { id: number; type: UpdateExamQuestionType }[]
  >([]);

  if (!session) return null;

  function addQuestion(type: UpdateExamQuestionType) {
    setQuestions((current) => [...current, { id: current.length + 1, type }]);
  }

  return (
    <AppShell roleBar={session.role} activeItem="profile" title="Sınavı Düzenle">
      <ExamSettingsCard />
      <UpdateExamQuestionTypePicker onAddQuestion={addQuestion} />
      {questions.map(({ id, type }) =>
        type === "multiple-choice" ? (
          <MultipleChoiceQuestionCard key={id} number={id} />
        ) : (
          <TrueFalseQuestionCard key={id} number={id} />
        ),
      )}
    </AppShell>
  );
}
