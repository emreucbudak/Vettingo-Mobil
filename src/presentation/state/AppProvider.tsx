import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import {
  AuthenticationInput,
  Session,
  Workspace,
} from "../../domain/entities/models";
import { WorkspaceCommand } from "../../application/contracts/WorkspaceCommand";
import { AppServices } from "../../application/AppServices";
interface AppContext {
  session: Session | null;
  state: Workspace;
  ready: boolean;
  storageError: string;
  services: AppServices;
  signIn: (input: AuthenticationInput) => Promise<void>;
  signOut: () => Promise<void>;
  dispatch: (command: WorkspaceCommand) => void;
}
const Context = createContext<AppContext | null>(null);
export function AppProvider({
  children,
  services,
}: React.PropsWithChildren<{ services: AppServices }>) {
  const [session, setSession] = useState<Session | null>(null);
  const [state, setState] = useState(() => services.sessions.createWorkspace());
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [catalogError, setCatalogError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const loadedSession = useRef<Session | null>(null);
  useEffect(() => {
    let mounted = true;
    async function restore() {
      try {
        await services.queries.load();
      } catch {
        if (mounted) setCatalogError(true);
        return;
      }
      try {
        const restored = await services.sessions.restore();
        if (!mounted) return;
        loadedSession.current = restored.session;
        setSession(restored.session);
        setState(restored.state);
      } catch {
        if (mounted)
          setStorageError(
            "Yerel kayıt okunamadı. Bu oturumdaki değişiklikler kaydedilemeyebilir.",
          );
      }
      if (mounted) setReady(true);
    }
    void restore();
    return () => {
      mounted = false;
    };
  }, [services, attempt]);
  useEffect(() => {
    if (!ready || !session || loadedSession.current !== session) return;
    void services.sessions
      .saveWorkspace(session, state)
      .catch(() => setStorageError("Değişiklikler cihazda kaydedilemedi."));
  }, [ready, session, state, services]);
  async function signIn(input: AuthenticationInput) {
    const restored = await services.sessions.signIn(input);
    loadedSession.current = restored.session;
    setState(restored.state);
    setSession(restored.session);
    setStorageError("");
  }
  async function signOut() {
    const fresh = await services.sessions.signOut();
    loadedSession.current = null;
    setSession(null);
    setState(fresh);
  }
  const dispatch = useCallback(
    (command: WorkspaceCommand) =>
      setState((current) => services.workspace.execute(current, command)),
    [services],
  );
  // Screens mount after catalog and persisted state have been restored.
  if (!ready)
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {catalogError ? (
          <>
            <Text>Veriler yüklenemedi.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setCatalogError(false);
                setAttempt((value) => value + 1);
              }}
            >
              <Text>Tekrar Dene</Text>
            </Pressable>
          </>
        ) : (
          <>
            <ActivityIndicator />
            <Text>Vettingo yükleniyor…</Text>
          </>
        )}
      </View>
    );
  return (
    <Context.Provider
      value={{
        session,
        state,
        ready,
        storageError,
        services,
        signIn,
        signOut,
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error("AppProvider is required");
  return value;
}
