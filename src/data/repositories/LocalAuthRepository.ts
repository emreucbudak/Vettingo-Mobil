import { AuthenticationInput, Session } from "../../domain/entities/models";
import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { AsyncStorageSource } from "../datasources/AsyncStorageSource";
const SESSION_KEY = "vettingo:demo-session:v1";
export class LocalAuthRepository implements AuthRepository {
  constructor(private readonly storage: AsyncStorageSource) {}
  async restore(): Promise<Session | null> {
    const raw = await this.storage.read(SESSION_KEY);
    try {
      const saved: Session | null = raw ? JSON.parse(raw) : null;
      return saved &&
        ["candidate", "employer", "hr"].includes(saved.role) &&
        typeof saved.email === "string" &&
        typeof saved.name === "string" &&
        saved.remember
        ? saved
        : null;
    } catch {
      return null;
    }
  }
  async authenticate(input: AuthenticationInput): Promise<Session> {
    // Demo identity only. No password is persisted or sent to a server.
    return {
      email: input.email.trim(),
      name: input.register
        ? `${input.name!.trim()} ${input.surname!.trim()}`
        : input.email.trim().split("@")[0],
      company: input.company?.trim() ?? "",
      role: input.role,
      remember: input.remember,
    };
  }
  save(session: Session) {
    return this.storage.write(
      SESSION_KEY,
      session.remember ? JSON.stringify(session) : null,
    );
  }
  clear() {
    return this.storage.write(SESSION_KEY, null);
  }
}
