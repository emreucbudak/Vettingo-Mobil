import React from "react";
import { AppShell } from "../../core/presentation/layout/AppShell";
import { useApp } from "../../core/presentation/state/AppProvider";
import { ExamEditorWidget } from "../../widgets/exam-editor/ExamEditorWidget";

export default function CreateExamPage() {
  const { session } = useApp();
  if (!session) return null;

  return (
    <AppShell roleBar={session.role} activeItem="profile">
      <ExamEditorWidget />
    </AppShell>
  );
}
