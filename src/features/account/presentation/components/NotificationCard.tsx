import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AccountNotification } from "../../domain/entities/AccountNotification";
import { colors } from "../../../../shared/presentation/components/ui";

export function NotificationCard({
  notification,
}: {
  notification: AccountNotification;
}) {
  const receivedAt = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(notification.createdAt));

  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Ionicons
          name="notifications-outline"
          size={23}
          color={colors.blue}
          accessible={false}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.meta}>
          <Text style={styles.source}>Vettingo</Text>
          {!notification.read && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Yeni</Text>
            </View>
          )}
        </View>
        <Text accessibilityRole="header" style={styles.title}>
          {notification.title}
        </Text>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.time}>{receivedAt}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 18,
  },
  icon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1, minWidth: 0, gap: 8 },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  source: { color: colors.muted, fontSize: 12, fontWeight: "600" },
  badge: {
    borderRadius: 6,
    backgroundColor: colors.soft,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeText: { color: colors.blue, fontSize: 11, fontWeight: "700" },
  title: { color: colors.ink, fontSize: 16, lineHeight: 23, fontWeight: "700" },
  message: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  time: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 2 },
});
