import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Loading } from "../../../shared/presentation/components/ui";
import { WorkspaceCatalogGate } from "../layout/WorkspaceCatalogGate";
import {
  AuthenticationInput,
  Role,
  Session,
} from "../../../features/auth/domain/entities/Session";
import { Workspace } from "../../domain/entities/Workspace";
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
  openTemporaryWorkspace: (role: Role) => void;
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
  const loadedSession = useRef<Session | null>(null);
  useEffect(() => {
    let mounted = true;
    async function restore() {
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
  }, [services]);
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
  function openTemporaryWorkspace(role: Role) {
    if (!__DEV__ || !ready) return;
    const temporary = services.sessions.createTemporaryWorkspace(role);
    loadedSession.current = null;
    setSession(temporary.session);
    setState(temporary.state);
    setStorageError("");
  }
  const dispatch = useCallback(
    (command: WorkspaceCommand) =>
      setState((current) => services.workspace.execute(current, command)),
    [services],
  );
  // The startup logo only waits for the persisted session and its local state.
  if (!ready) return <Loading />;
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
        openTemporaryWorkspace,
        dispatch,
      }}
    >
      {session ? (
        <WorkspaceCatalogGate services={services}>
          {children}
        </WorkspaceCatalogGate>
      ) : (
        children
      )}
    </Context.Provider>
  );
}
export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error("AppProvider is required");
  return value;
}
