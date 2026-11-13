import React from "react";
import { useLocalSearchParams } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { CompanyDetails } from "../components/CompanyDetails";

export default function CandidateCompanyDetailScreen() {
  const { companyName, tab } = useLocalSearchParams<{
    companyName?: string;
    tab?: string;
  }>();
  const activeItem =
    tab === "home" ? "dashboard" : tab === "profile" ? "profile" : "search";

  return (
    <AppShell roleBar="candidate" activeItem={activeItem}>
      <CompanyDetails companyName={companyName ?? ""} />
    </AppShell>
  );
}
