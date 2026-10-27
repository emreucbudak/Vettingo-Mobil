import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { AccountNotification } from "../../domain/entities/AccountNotification";
import { Empty } from "../../../../shared/presentation/components/ui";
import { NotificationCard } from "../components/NotificationCard";

export default function NotificationsScreen() {
  const { services, session } = useApp();
  const [notifications, setNotifications] = useState<
    readonly AccountNotification[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const requestId = useRef(0);
  const userId = session?.userId;
  const accessToken = session?.accessToken;

  const loadNotifications = useCallback(() => {
    const currentRequest = ++requestId.current;
    setNotifications([]);
    setFailed(false);
    setLoading(true);

    void services.notifications
      .list({ userId, accessToken })
      .then((items) => {
        if (currentRequest === requestId.current) setNotifications(items);
      })
      .catch(() => {
        if (currentRequest === requestId.current) setFailed(true);
      })
      .finally(() => {
        if (currentRequest === requestId.current) setLoading(false);
      });
  }, [services.notifications, userId, accessToken]);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
      return () => {
        requestId.current += 1;
      };
    }, [loadNotifications]),
  );

  return (
    <AppShell>
      {loading && (
        <ActivityIndicator accessibilityLabel="Bildirimler yükleniyor" />
      )}
      {!loading && !failed && notifications.length === 0 && (
        <Empty label="Henüz bildiriminiz bulunmuyor." />
      )}
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </AppShell>
  );
}
