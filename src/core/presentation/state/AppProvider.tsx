import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AuthenticationInput,
  Role,
  Session,
} from "../../../features/auth/domain/entities/Session";
import { Workspace } from "../../domain/entities/Workspace";
import { WorkspaceCommand } from "../../application/contracts/WorkspaceCommand";
import { AppServices } from "../../application/AppServices";
type PendingAuthentication =
  AuthenticationInput | { register: boolean; previewRole: Role };

interface AppContext {
  session: Session | null;
  state: Workspace;
  ready: boolean;
  storageError: string;
  services: AppServices;
  signIn: (input: AuthenticationInput) => Promise<void>;
  beginAuthentication: (input: PendingAuthentication) => void;
  completeAuthentication: (register: boolean) => Promise<boolean>;
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
  const initialized = useRef(false);
  // Form credentials stay in memory until the code screen is completed.
  const pendingAuthentication = useRef<PendingAuthentication | null>(null);
  useEffect(() => {
    // Fast Refresh must not overwrite an active preview with the saved session.
    if (initialized.current) return;
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
      if (mounted) {
        initialized.current = true;
        setReady(true);
      }
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
    pendingAuthentication.current = null;
    loadedSession.current = restored.session;
    setState(restored.state);
    setSession(restored.session);
    setStorageError("");
  }
  async function signOut() {
    const fresh = await services.sessions.signOut();
    pendingAuthentication.current = null;
    loadedSession.current = null;
    setSession(null);
    setState(fresh);
  }
  function openTemporaryWorkspace(role: Role) {
    if (!__DEV__ || !ready) return;
    const temporary = services.sessions.createTemporaryWorkspace(role);
    pendingAuthentication.current = null;
    loadedSession.current = null;
    setSession(temporary.session);
    setState(temporary.state);
    setStorageError("");
  }
  function beginAuthentication(input: PendingAuthentication) {
    pendingAuthentication.current = { ...input };
  }
  async function completeAuthentication(register: boolean) {
    const pending = pendingAuthentication.current;
    if (!pending || pending.register !== register) return false;
    if ("previewRole" in pending) {
      if (!__DEV__) return false;
      openTemporaryWorkspace(pending.previewRole);
    } else {
      await signIn(pending);
    }
    return true;
  }
  const dispatch = useCallback(
    (command: WorkspaceCommand) =>
      setState((current) => services.workspace.execute(current, command)),
    [services],
  );
  // The native splash stays visible until the initial session check completes.
  if (!ready) return null;
  return (
    <Context.Provider
      value={{
        session,
        state,
        ready,
        storageError,
        services,
        signIn,
        beginAuthentication,
        completeAuthentication,
        signOut,
        openTemporaryWorkspace,
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
