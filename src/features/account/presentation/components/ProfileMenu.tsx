import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../shared/presentation/components/ui";

export function ProfileMenuGroup({ children }: React.PropsWithChildren) {
  return (
    <View style={menuStyles.group}>
      {React.Children.toArray(children).map((child, index) => (
        <React.Fragment key={index}>
          {index > 0 && <View style={menuStyles.separator} />}
          {child}
        </React.Fragment>
      ))}
    </View>
  );
}

export function ProfileMenuRow({
  label,
  description,
  onPress,
  accessory,
  danger = false,
}: {
  label: string;
  description?: string;
  onPress?: () => void;
  accessory?: React.ReactNode;
  danger?: boolean;
}) {
  const content = (
    <>
      <View style={menuStyles.copy}>
        <Text style={[menuStyles.label, danger && { color: colors.red }]}>
          {label}
        </Text>
        {description && (
          <Text style={menuStyles.description}>{description}</Text>
        )}
      </View>
      {accessory ?? (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={danger ? colors.red : colors.muted}
          accessible={false}
        />
      )}
    </>
  );
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        menuStyles.row,
        pressed && { backgroundColor: colors.soft },
      ]}
    >
      {content}
    </Pressable>
  ) : (
    <View style={menuStyles.row}>{content}</View>
  );
}

const menuStyles = StyleSheet.create({
  group: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  row: {
    minHeight: 76,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  copy: { flex: 1, gap: 6 },
  label: { color: colors.ink, fontSize: 16, lineHeight: 23, fontWeight: "600" },
  description: { color: colors.muted, fontSize: 12, lineHeight: 19 },
  separator: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: colors.border,
  },
});
