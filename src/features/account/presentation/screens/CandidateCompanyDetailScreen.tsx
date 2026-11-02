import React from "react";
import { useLocalSearchParams } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { CompanyDetails } from "../components/CompanyDetails";

export default function CandidateCompanyDetailScreen() {
  const { companyName } = useLocalSearchParams<{ companyName?: string }>();

  return (
    <AppShell>
      <CompanyDetails companyName={companyName ?? ""} />
    </AppShell>
  );
}
