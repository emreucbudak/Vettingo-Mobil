import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { colors } from "../../../../shared/presentation/components/ui";

type PlanPreview = {
  name: string;
  price: number;
  features: readonly string[];
};

const previewPlans: readonly PlanPreview[] = [
  {
    name: "Başlangıç",
    price: 0,
    features: ["1 aktif iş ilanı", "Aday başvurularını görüntüleme"],
  },
  {
    name: "Profesyonel",
    price: 29,
    features: [
      "5 aktif iş ilanı",
      "Aday başvurularını yönetme",
      "Yetenek havuzunda arama",
    ],
  },
  {
    name: "Kurumsal",
    price: 79,
    features: [
      "Sınırsız iş ilanı",
      "Yetenek havuzunda arama",
      "Ekip ve işe alım yönetimi",
    ],
  },
];

const accent = "#6F42E8";
const borderColor = "#E3E5E9";

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: PlanPreview;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <View style={[styles.card, selected && styles.selectedCard]}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.name}>
          {plan.name}
        </Text>
        <View style={styles.pricing}>
          <Text style={styles.price}>${plan.price}</Text>
          <Text style={styles.billing}>
            {plan.price === 0 ? "Her zaman ücretsiz" : "Kullanıcı / ay"}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.features}>
        {plan.features.map((feature) => (
          <View key={feature} style={styles.feature}>
            <View style={[styles.check, selected && styles.selectedCheck]}>
              <Ionicons
                name="checkmark"
                size={12}
                color="#FFFFFF"
                accessible={false}
              />
            </View>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${plan.name} planını seç`}
        accessibilityState={{ selected }}
        onPress={onSelect}
        style={({ pressed }) => [
          styles.button,
          selected && styles.selectedButton,
          pressed && styles.pressedButton,
        ]}
      >
        <Text
          style={[styles.buttonText, selected && styles.selectedButtonText]}
        >
          {selected ? "Seçildi" : `${plan.name} Planını Seç`}
        </Text>
      </Pressable>
    </View>
  );
}

export default function EmployerPlansScreen() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <AppShell roleBar="employer" activeItem="profile">
      {previewPlans.map((plan) => (
        <PlanCard
          key={plan.name}
          plan={plan}
          selected={selectedPlan === plan.name}
          onSelect={() => setSelectedPlan(plan.name)}
        />
      ))}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor,
    borderRadius: 28,
    borderWidth: 1,
    padding: 20,
    boxShadow: "0 8px 24px rgba(9, 20, 38, 0.06)",
  },
  selectedCard: { borderColor: accent },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 16,
  },
  name: {
    flex: 1,
    color: colors.primary,
    fontSize: 23,
    fontWeight: "700",
    letterSpacing: -0.45,
  },
  pricing: { maxWidth: "55%", gap: 4 },
  price: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    letterSpacing: -0.65,
    textAlign: "right",
  },
  billing: { color: "#5D626B", fontSize: 12, textAlign: "right" },
  divider: { height: 1, backgroundColor: borderColor, marginVertical: 18 },
  features: { gap: 12, marginBottom: 22 },
  feature: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  check: {
    width: 18,
    height: 18,
    marginTop: 1,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34373D",
  },
  selectedCheck: { backgroundColor: accent },
  featureText: { flex: 1, color: "#34373D", fontSize: 14, lineHeight: 20 },
  button: {
    minHeight: 48,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D7D9DE",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: { backgroundColor: accent, borderColor: accent },
  pressedButton: { opacity: 0.75 },
  buttonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  selectedButtonText: { color: "#FFFFFF" },
});
