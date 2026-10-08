import { AuthenticationInput, Session } from "../entities/Session";
export interface AuthRepository {
  restore(): Promise<Session | null>;
  authenticate(input: AuthenticationInput): Promise<Session>;
  save(session: Session): Promise<void>;
  clear(): Promise<void>;
}
