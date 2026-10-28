import React from "react";
import { Text, View } from "react-native";
import { router, Href } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import {
  Badge,
  Card,
  colors,
  Label,
  Section,
  styles,
  Title,
} from "../../../../shared/presentation/components/ui";
import { ApplicationCard } from "../../../applications/presentation/components/ApplicationCard";
import { DashboardCandidateCard } from "../components/DashboardCandidateCard";
import { CandidateCard } from "../../../candidates/presentation/components/CandidateCard";
import { JobSearchCard } from "../../../jobs/presentation/components/JobSearchCard";
import { DashboardRequisitionCard } from "../components/DashboardRequisitionCard";
import { ScoutEntryCard } from "../../../candidates/presentation/components/ScoutEntryCard";
import { CreateCvPrompt } from "../components/CreateCvPrompt";

export default function DashboardScreen() {
  const { session, state, services } = useApp();
  const { candidates } = services.candidates.catalog;
  const { recommendations } = services.jobs.catalog;
  if (!session) return null;
  if (session.role === "candidate")
    return (
      <AppShell>
        <CreateCvPrompt key={session.userId ?? session.email} />
        <Section
          title="Aktif Başvurular"
          action="Tümünü Gör"
          onPress={() => router.push("/candidate-applications")}
        />
        {state.applications
          .filter((item) => item.status !== "Rejected")
          .slice(0, 2)
          .map((item) => (
            <ApplicationCard key={item.id} item={item} compact />
          ))}
        <Section
          title="Önerilen İlanlar"
          action="Tümünü Gör"
          onPress={() => router.push("/candidate-personalized-jobs")}
        />
        {recommendations.map((job) => (
          <JobSearchCard
            key={job.id}
            job={job}
            onPress={() =>
              router.push({ pathname: "/job-detail", params: { id: job.id } })
            }
          />
        ))}
      </AppShell>
    );
  const hr = session.role === "hr";
  const metrics = hr
    ? [
        ["Toplam Başvuru", "1,248"],
        ["Açık Pozisyon", String(14 + state.requisitions.length - 3)],
        ["Aktif Aday", "8"],
        ["Teklif Aşaması", "5"],
      ]
    : [
        ["Toplam Başvuru", "1,248"],
        ["Açık Pozisyon", String(14 + state.requisitions.length - 3)],
        ["Aktif Aday", "842"],
        ["Büyüme", "+12%"],
      ];
  return (
    <AppShell>
      <View style={styles.wrap}>
        {metrics.map(([label, value], index) => (
          <View key={label} style={{ width: "48%", flexGrow: 1 }}>
            <Card>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  backgroundColor: index % 2 ? "#F5F3FF" : colors.soft,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {label === "Toplam Başvuru" ||
                label === "Açık Pozisyon" ||
                label === "Aktif Aday" ? (
                  <MaterialIcons
                    name={
                      label === "Toplam Başvuru"
                        ? "groups"
                        : label === "Aktif Aday"
                          ? "person"
                          : "search"
                    }
                    size={22}
                    color={colors.blue}
                  />
                ) : (
                  <Text style={{ color: colors.blue }}>↗</Text>
                )}
              </View>
              <Text
                style={{ color: colors.ink, fontSize: 29, fontWeight: "800" }}
              >
                {value}
              </Text>
              <Label muted>{label}</Label>
            </Card>
          </View>
        ))}
      </View>
      <ScoutEntryCard />
      {hr && (
        <>
          <Section title="Yaklaşan Mülakatlar" />
          {[
            ["10:30", "Sarah Jenkins", "Teknik görüşme"],
            ["15:00", "Michael Ross", "İK görüşmesi"],
          ].map(([time, name, type]) => (
            <Card key={time}>
              <View style={styles.row}>
                <Badge success={false}>{time}</Badge>
                <View style={{ flex: 1 }}>
                  <Title small>{name}</Title>
                  <Label muted>{type}</Label>
                </View>
              </View>
            </Card>
          ))}
        </>
      )}
      {hr && (
        <>
          <Section
            title="Öne Çıkan Adaylar"
            action="Tümünü Gör"
            onPress={() => router.push(`/${session.role}-candidates` as Href)}
          />
          {candidates.slice(0, 2).map((candidate) => (
            <DashboardCandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </>
      )}
      {!hr && (
        <>
          <Section
            title="Aktif İlanlar"
            action="Tümünü Gör"
            onPress={() => router.push("/employer-jobs")}
          />
          {state.requisitions.slice(0, 3).map((job) => (
            <DashboardRequisitionCard key={job.id} job={job} />
          ))}
          <Section
            title="Adaylar"
            action="Tümünü Gör"
            onPress={() => router.push("/employer-candidates")}
          />
          {candidates.slice(0, 3).map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </>
      )}
    </AppShell>
  );
}
