import React from "react";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";

export default function ExamDetailScreen() {
  const { session } = useApp();
  if (!session) return null;
  return <AppShell roleBar={session.role} activeItem="jobs" />;
}
