import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { AppServices } from "../../application/AppServices";
import { colors, styles } from "../../../shared/presentation/components/ui";

export function WorkspaceCatalogGate({
  children,
  services,
}: React.PropsWithChildren<{ services: AppServices }>) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        await services.loadCatalogs();
        if (mounted) setReady(true);
      } catch {
        if (mounted) setError(true);
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, [services, attempt]);

  if (ready) return <>{children}</>;
  return (
    <View
      style={[
        styles.page,
        { alignItems: "center", justifyContent: "center", gap: 16 },
      ]}
    >
      {error ? (
        <>
          <Text>Veriler yüklenemedi.</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setError(false);
              setAttempt((value) => value + 1);
            }}
          >
            <Text>Tekrar Dene</Text>
          </Pressable>
        </>
      ) : (
        <ActivityIndicator
          color={colors.blue}
          accessibilityRole="progressbar"
          accessibilityLabel="Veriler yükleniyor…"
        />
      )}
    </View>
  );
}
