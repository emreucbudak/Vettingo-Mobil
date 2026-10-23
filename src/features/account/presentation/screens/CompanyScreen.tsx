import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { colors } from "../../../../shared/presentation/components/ui";

// Display-only values until company details are supplied by the API.
const companyDescription =
  "Yenilikçi ürünler geliştiren, teknoloji ve insanı bir araya getiren bir ekibiz. Birlikte öğrenmeye, üretmeye ve büyümeye önem veriyor; geleceği şekillendirecek yeteneklerle buluşuyoruz.";
const statistics = [
  { label: "Açık Pozisyon", value: "12" },
  { label: "Başvuru", value: "248" },
  { label: "Mülakat", value: "8" },
  { label: "Görüşülen Aday", value: "0" },
];

export default function CompanyScreen() {
  const { session } = useApp();

  return (
    <AppShell>
      <View style={companyStyles.details}>
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel="Şirket logosu alanı"
          style={companyStyles.logoCircle}
        >
          <Ionicons
            name="business-outline"
            size={48}
            color={colors.blue}
            accessible={false}
          />
        </View>
        <Text accessibilityRole="header" style={companyStyles.name}>
          {session?.company.trim() || "Vettingo"}
        </Text>
        <Text style={companyStyles.description}>{companyDescription}</Text>
      </View>
      <View style={companyStyles.statistics}>
        {statistics.map((statistic) => (
          <View
            key={statistic.label}
            accessible
            accessibilityLabel={`${statistic.value} ${statistic.label}`}
            style={companyStyles.statistic}
          >
            <Text style={companyStyles.value}>{statistic.value}</Text>
            <Text style={companyStyles.statisticLabel}>{statistic.label}</Text>
          </View>
        ))}
      </View>
    </AppShell>
  );
}

const companyStyles = StyleSheet.create({
  details: {
    alignItems: "center",
    gap: 18,
    paddingTop: 12,
    paddingBottom: 10,
  },
  logoCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.soft,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  name: {
    color: colors.ink,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 520,
  },
  statistics: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
    gap: 10,
  },
  statistic: {
    flexBasis: "48%",
    flexGrow: 1,
    minWidth: 0,
    paddingHorizontal: 8,
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  value: {
    color: colors.blue,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "800",
    textAlign: "center",
  },
  statisticLabel: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
