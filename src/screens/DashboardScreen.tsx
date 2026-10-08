import React from "react";
import { Text, View } from "react-native";
import { router, Href } from "expo-router";
import { useApp } from "../state/AppProvider";
import { candidates, recommendations } from "../data/demo";
import {
  AppShell,
  Badge,
  Button,
  Card,
  colors,
  Label,
  Progress,
  Section,
  styles,
  Title,
} from "../components/ui";
import {
  ApplicationCard,
  CandidateCard,
  JobCard,
  RequisitionCard,
} from "../components/cards";

export default function DashboardScreen() {
  const { session, state } = useApp();
  if (!session) return null;
  if (session.role === "candidate")
    return (
      <AppShell>
        <View style={{ gap: 6 }}>
          <Label muted>
            {new Intl.DateTimeFormat("tr-TR", { dateStyle: "full" }).format(
              new Date(),
            )}
          </Label>
          <Title>Merhaba, {session.name.split(" ")[0]} 👋</Title>
          <Label muted>
            {
              state.applications.filter((item) => item.status !== "Rejected")
                .length
            }{" "}
            aktif başvurun ve yeni önerilen rollerin var.
          </Label>
        </View>
        <Section
          title="Aktif Başvurular"
          action="Tümünü Gör"
          onPress={() => router.push("/candidate-applications")}
        />
        {state.applications
          .filter((item) => item.status !== "Rejected")
          .slice(0, 2)
          .map((item) => (
            <ApplicationCard key={item.id} item={item} />
          ))}
        <Section title="Pazar Profilin" />
        <View
          style={[
            styles.card,
            { backgroundColor: colors.primary, borderColor: colors.primary },
          ]}
        >
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#fff", fontSize: 19, fontWeight: "700" }}>
                Strong Match Profile
              </Text>
              <Text
                style={{
                  color: "#B7C6DF",
                  fontSize: 13,
                  lineHeight: 20,
                  marginTop: 8,
                }}
              >
                React ve TypeScript yeteneklerin bu hafta en çok aranan %15
                arasında.
              </Text>
            </View>
            <Text style={{ fontSize: 44, color: "#fff", fontWeight: "800" }}>
              85
            </Text>
          </View>
          <Progress value={0.85} />
          <View style={styles.row}>
            <Badge>React 98%</Badge>
            <Badge>TypeScript 92%</Badge>
          </View>
        </View>
        <Section
          title="Önerilen Eşleşmeler"
          action="Keşfet"
          onPress={() => router.push("/job-search")}
        />
        {recommendations.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </AppShell>
    );
  const hr = session.role === "hr";
  const metrics = hr
    ? [
        ["Açık Pozisyon", String(14 + state.requisitions.length - 3)],
        ["Yeni Başvuru", "36"],
        ["Mülakat", "8"],
        ["Teklif Aşaması", "5"],
      ]
    : [
        ["Toplam Başvuru", "1,248"],
        ["Açık Pozisyon", String(14 + state.requisitions.length - 3)],
        ["AI ile İşlenen", "842"],
        ["Büyüme", "+12%"],
      ];
  return (
    <AppShell>
      {!hr && (
        <View style={{ gap: 6 }}>
          <Title>İşe Alım Özeti</Title>
          <Label muted>Adayları keşfedin, ekiplerinizi büyütün.</Label>
        </View>
      )}
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
                <Text style={{ color: colors.blue }}>↗</Text>
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
      <Section
        title={hr ? "Öne Çıkan Adaylar" : "En İyi AI Eşleşmeleri"}
        action="Tümünü Gör"
        onPress={() => router.push(`/${session.role}-candidates` as Href)}
      />
      {candidates.slice(0, 2).map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} />
      ))}
      {!hr && (
        <>
          <Section
            title="Aktif Pozisyonlar"
            action="Tümünü Gör"
            onPress={() => router.push("/employer-jobs")}
          />
          {state.requisitions.slice(0, 3).map((job) => (
            <RequisitionCard key={job.id} job={job} />
          ))}
          <Button
            label="Yeni İlan Oluştur"
            onPress={() => router.push("/new-requisition")}
          />
        </>
      )}
    </AppShell>
  );
}
