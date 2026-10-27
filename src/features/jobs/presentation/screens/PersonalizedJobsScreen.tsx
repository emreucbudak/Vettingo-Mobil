import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import {
  Button,
  Empty,
  Label,
} from "../../../../shared/presentation/components/ui";
import { JobSearchCard } from "../components/JobSearchCard";
import { JobSummary } from "../../domain/entities/Job";

export default function PersonalizedJobsScreen() {
  const { services, session } = useApp();
  const [recommendations, setRecommendations] = useState<readonly JobSummary[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestId = useRef(0);
  const accessToken = session?.accessToken;

  const load = useCallback(() => {
    const currentRequest = ++requestId.current;
    setRecommendations([]);
    setError("");
    setLoading(true);
    void services.personalizedJobs
      .list({ accessToken })
      .then((jobs) => {
        if (currentRequest === requestId.current) setRecommendations(jobs);
      })
      .catch((failure: unknown) => {
        if (currentRequest === requestId.current) {
          setError(
            failure instanceof Error ? failure.message : "İlanlar yüklenemedi.",
          );
        }
      })
      .finally(() => {
        if (currentRequest === requestId.current) setLoading(false);
      });
  }, [services.personalizedJobs, accessToken]);

  useFocusEffect(
    useCallback(() => {
      load();
      return () => {
        requestId.current += 1;
      };
    }, [load]),
  );

  return (
    <AppShell>
      {loading && <ActivityIndicator accessibilityLabel="İlanlar yükleniyor" />}
      {!!error && (
        <>
          <Label>{error}</Label>
          <Button label="Tekrar Dene" onPress={load} secondary />
        </>
      )}
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
      {!loading && !error && !recommendations.length && <Empty />}
    </AppShell>
  );
}
