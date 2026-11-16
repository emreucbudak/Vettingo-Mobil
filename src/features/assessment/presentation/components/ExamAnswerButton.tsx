import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, styles } from "../../../../shared/presentation/components/ui";

export function ExamAnswerButton({
  label,
  checked,
  showLabel = false,
  onPress,
}: {
  label: string;
  checked: boolean;
  showLabel?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      onPress={onPress}
      style={[
        answerStyles.button,
        showLabel && answerStyles.labeledButton,
        checked && answerStyles.checkedButton,
      ]}
    >
      {showLabel && <Text style={styles.label}>{label}</Text>}
      <Ionicons
        name={checked ? "checkmark-circle" : "ellipse-outline"}
        size={20}
        color={checked ? colors.green : colors.muted}
        accessible={false}
      />
    </Pressable>
  );
}

const answerStyles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
    minHeight: 44,
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#fff",
  },
  labeledButton: { flex: 1, paddingHorizontal: 8 },
  checkedButton: { borderColor: colors.green, backgroundColor: colors.greenBg },
});
