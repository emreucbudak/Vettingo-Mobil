import React, { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { CreateCvCard } from "./CreateCvCard";

export function CreateCvPrompt() {
  const { services, session } = useApp();
  const [hasCv, setHasCv] = useState<boolean | null>(null);
  const requestId = useRef(0);
  const userId = session?.userId;
  const accessToken = session?.accessToken;

  const loadCvStatus = useCallback(() => {
    const currentRequest = ++requestId.current;
    setHasCv(null);

    void services.cv
      .hasCv({ userId, accessToken })
      .then((exists) => {
        if (currentRequest === requestId.current) setHasCv(exists);
      })
      .catch(() => {
        // Keep the prompt hidden when the CV status cannot be determined.
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

  if (hasCv !== false) return null;

  return <CreateCvCard />;
}
