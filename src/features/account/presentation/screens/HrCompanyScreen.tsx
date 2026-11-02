import React from "react";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { CompanyDetails } from "../components/CompanyDetails";

export default function HrCompanyScreen() {
  const { session } = useApp();

  return (
    <AppShell>
      <CompanyDetails companyName={session?.company ?? ""} />
    </AppShell>
  );
}
