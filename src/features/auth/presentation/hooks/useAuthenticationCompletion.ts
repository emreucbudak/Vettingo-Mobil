import { useRef, useState } from "react";
import { router } from "expo-router";
import { useApp } from "../../../../core/presentation/state/AppProvider";

export function useAuthenticationCompletion(register: boolean) {
  const { completeAuthentication } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);

  async function complete() {
    if (submitting.current) return;
    submitting.current = true;
    setLoading(true);
    setError("");
    try {
      const completed = await completeAuthentication(register);
      if (!completed) router.replace(register ? "/register" : "/login");
      // Protected routes open the existing dashboard after the session commits.
    } catch {
      setError("Oturum açılamadı. Lütfen tekrar deneyin.");
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  return { submitCode: () => void complete(), loading, error };
}
