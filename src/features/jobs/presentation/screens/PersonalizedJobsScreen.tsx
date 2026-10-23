import React from "react";
import { router } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { Empty } from "../../../../shared/presentation/components/ui";
import { JobSearchCard } from "../components/JobSearchCard";

export default function PersonalizedJobsScreen() {
  const { services } = useApp();
  const { recommendations } = services.jobs.catalog;

  return (
    <AppShell>
      {recommendations.map((job) => (
        <JobSearchCard
          key={job.id}
          job={job}
          onPress={() =>
            router.push({
              pathname: "/job-detail",
              params: { id: job.id, tab: "profile" },
            })
          }
        />
      ))}
      {!recommendations.length && <Empty />}
    </AppShell>
  );
}
