import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CandidateFilter } from "../../domain/policies/filters";
import { colors, Dialog } from "../../../../shared/presentation/components/ui";

const filterGroups: {
  title: string;
  options: { value: CandidateFilter; label: string }[];
}[] = [
  {
    title: "Tecrübe",
    options: [
      { value: "experience:0:5", label: "0–5 yıl" },
      { value: "experience:5:10", label: "5–10 yıl" },
      { value: "experience:10:Infinity", label: "10+ yıl" },
    ],
  },
  {
    title: "Maaş",
    options: [
      { value: "salary:0:50000", label: "0–50.000" },
      { value: "salary:50000:100000", label: "50.000–100.000" },
      { value: "salary:100000:Infinity", label: "100.000+" },
    ],
  },
  {
    title: "Çalışma Tercihi",
    options: [
      { value: "onsite", label: "Ofisten" },
      { value: "hybrid", label: "Hybrid" },
      { value: "remote", label: "Uzaktan" },
    ],
  },
];

export function ScoutFiltersDialog({
  visible,
  filters,
  onChange,
  onClose,
}: {
  visible: boolean;
  filters: CandidateFilter[];
  onChange: (filters: CandidateFilter[]) => void;
  onClose: () => void;
}) {
  function toggleFilter(value: CandidateFilter, options: CandidateFilter[]) {
    const remaining = filters.filter((filter) => !options.includes(filter));
    onChange(filters.includes(value) ? remaining : [...remaining, value]);
  }

  return (
    <Dialog
      title=""
      closeIcon
      headerBottomPadding={0}
      visible={visible}
      onClose={onClose}
    >
      {filterGroups.map((group) => (
        <View key={group.title} style={dialogStyles.group}>
          <Text accessibilityRole="header" style={dialogStyles.heading}>
            {group.title}
          </Text>
          <View style={dialogStyles.options}>
            {group.options.map((option) => {
              const selected = filters.includes(option.value);
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityLabel={option.label}
                  accessibilityState={{ selected }}
                  onPress={() =>
                    toggleFilter(
                      option.value,
                      group.options.map((item) => item.value),
                    )
                  }
                  style={[
                    dialogStyles.option,
                    selected && dialogStyles.selectedOption,
                  ]}
                >
                  <Text
                    style={[
                      dialogStyles.optionLabel,
                      selected && dialogStyles.selectedLabel,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </Dialog>
  );
}

const dialogStyles = StyleSheet.create({
  group: { gap: 12 },
  heading: { color: colors.ink, fontSize: 19, fontWeight: "700" },
  options: { flexDirection: "row", gap: 8 },
  option: {
    width: "30%",
    flexGrow: 1,
    minHeight: 48,
    paddingHorizontal: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.soft,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  optionLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  selectedLabel: { color: "#fff" },
});
