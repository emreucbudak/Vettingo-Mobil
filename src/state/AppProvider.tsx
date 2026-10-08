import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Action, Session, Workspace } from "../domain/models";
import {
  initialWorkspace,
  restoreWorkspace,
  workspaceReducer,
} from "../domain/workflows";

const SESSION_KEY = "vettingo:demo-session:v1";
const workspaceKey = (session: Session) =>
  `vettingo:workspace:v1:${session.role}:${session.email.toLowerCase()}`;
interface AppContext {
  session: Session | null;
  state: Workspace;
  ready: boolean;
  storageError: string;
  signIn: (session: Session) => Promise<void>;
  signOut: () => Promise<void>;
  dispatch: (action: Action) => void;
}
const Context = createContext<AppContext | null>(null);
// Serialize storage operations so a slower previous write cannot overwrite a newer one.
let writes = Promise.resolve();
function persist(key: string, value: string | null) {
  const next = writes
    .catch(() => {})
    .then(() =>
      value === null
        ? AsyncStorage.removeItem(key)
        : AsyncStorage.setItem(key, value),
    );
  writes = next;
  return next;
}
export function AppProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [state, setState] = useState(initialWorkspace);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const loadedKey = useRef<string | null>(null);
  useEffect(() => {
    let mounted = true;
    void AsyncStorage.getItem(SESSION_KEY)
      .then(async (raw) => {
        let saved: Session | null = null;
        try {
          saved = raw ? JSON.parse(raw) : null;
        } catch {
          /* invalid session returns to login */
        }
        if (
          saved &&
          (!["candidate", "employer", "hr"].includes(saved.role) ||
            typeof saved.email !== "string" ||
            !saved.remember)
        )
          saved = null;
        const restored = saved
          ? restoreWorkspace(await AsyncStorage.getItem(workspaceKey(saved)))
          : initialWorkspace();
        if (mounted) {
          loadedKey.current = saved ? workspaceKey(saved) : null;
          setSession(saved);
          setState(restored);
          setReady(true);
        }
      })
      .catch(() => {
        if (mounted) {
          setStorageError(
            "Yerel kayıt okunamadı. Bu oturumdaki değişiklikler kaydedilemeyebilir.",
          );
          setReady(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (!ready || !session || loadedKey.current !== workspaceKey(session))
      return;
    void persist(workspaceKey(session), JSON.stringify(state)).catch(() =>
      setStorageError("Değişiklikler cihazda kaydedilemedi."),
    );
  }, [ready, session, state]);
  async function signIn(next: Session) {
    await writes.catch(() => {});
    const restored = restoreWorkspace(
      await AsyncStorage.getItem(workspaceKey(next)),
    );
    await persist(SESSION_KEY, next.remember ? JSON.stringify(next) : null);
    loadedKey.current = workspaceKey(next);
    setState(restored);
    setSession(next);
    setStorageError("");
  }
  async function signOut() {
    await persist(SESSION_KEY, null);
    loadedKey.current = null;
    setSession(null);
    setState(initialWorkspace());
  }
  const dispatch = useCallback(
    (action: Action) =>
      setState((current) => workspaceReducer(current, action)),
    [],
  );
  return (
    <Context.Provider
      value={{ session, state, ready, storageError, signIn, signOut, dispatch }}
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
