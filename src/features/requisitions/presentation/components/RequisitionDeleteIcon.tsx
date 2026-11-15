import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../shared/presentation/components/ui";

export function RequisitionDeleteIcon() {
  return (
    <View pointerEvents="none" style={deleteIconStyles.circle}>
      <Ionicons
        name="trash-outline"
        size={16}
        color={colors.red}
        accessible={false}
      />
    </View>
  );
}

const deleteIconStyles = StyleSheet.create({
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.redBg,
  },
});
