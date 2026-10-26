import React, { useCallback, useRef, useState } from "react";
import { Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { Button, styles } from "../../../../shared/presentation/components/ui";
import { CreateCvCard } from "./CreateCvCard";

export function CreateCvPrompt() {
  const { services, session } = useApp();
  const [hasCv, setHasCv] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const requestId = useRef(0);
  const userId = session?.userId;
  const accessToken = session?.accessToken;

  const loadCvStatus = useCallback(() => {
    const currentRequest = ++requestId.current;
    setHasCv(null);
    setError("");

    void services.cv
      .hasCv({ userId, accessToken })
      .then((exists) => {
        if (currentRequest === requestId.current) setHasCv(exists);
      })
      .catch((reason: unknown) => {
        if (currentRequest === requestId.current)
          setError(
            reason instanceof Error
              ? reason.message
              : "CV durumu kontrol edilemedi. Lütfen tekrar deneyin.",
          );
      });
  }, [services.cv, userId, accessToken]);

  useFocusEffect(
    useCallback(() => {
      loadCvStatus();
      return () => {
        requestId.current += 1;
      };
    }, [loadCvStatus]),
  );

  if (hasCv === true) return null;

  if (error)
    return (
      <View style={{ gap: 8 }}>
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
        <Button
          label="CV durumunu tekrar kontrol et"
          secondary
          onPress={loadCvStatus}
        />
      </View>
    );

  if (hasCv === null) return null;

  return <CreateCvCard />;
}
