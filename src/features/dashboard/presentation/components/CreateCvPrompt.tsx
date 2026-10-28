import React, { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { CreateCvCard } from "./CreateCvCard";

export function CreateCvPrompt() {
  const { services, session } = useApp();
  const [hasCv, setHasCv] = useState<boolean | null>(null);
  const requestId = useRef(0);
  const accessToken = session?.accessToken;

  const loadCvStatus = useCallback(() => {
    const currentRequest = ++requestId.current;
    setHasCv(null);

    void services.cv
      .hasCv({ accessToken })
      .then((exists) => {
        if (currentRequest === requestId.current) setHasCv(exists);
      })
      .catch(() => {
        
      });
  }, [services.cv, accessToken]);

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
