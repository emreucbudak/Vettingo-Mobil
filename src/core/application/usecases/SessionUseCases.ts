import {
  AuthenticationInput,
  Session,
} from "../../../features/auth/domain/entities/Session";
import { AuthUseCases } from "../../../features/auth/application/usecases/AuthUseCases";
import { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository";
export class SessionUseCases {
  constructor(
    private readonly auth: AuthUseCases,
    private readonly workspace: WorkspaceRepository,
  ) {}
  validate(input: AuthenticationInput) {
    return this.auth.validate(input);
  }
  async restore() {
    const session = await this.auth.restore();
    return {
      session,
      state: session
        ? await this.workspace.load(session)
        : this.workspace.create(),
    };
  }
  async signIn(input: AuthenticationInput) {
    if (Object.keys(this.validate(input)).length)
      throw new Error("Invalid authentication input");
    await this.workspace.flush();
    const session = await this.auth.authenticate(input);
    const state = await this.workspace.load(session);
    await this.auth.save(session);
    return { session, state };
  }
  async signOut() {
    await this.workspace.flush();
    await this.auth.clear();
    return this.workspace.create();
  }
  createWorkspace() {
    return this.workspace.create();
  }
  saveWorkspace(
    session: Session,
    state: Parameters<WorkspaceRepository["save"]>[1],
  ) {
    return this.workspace.save(session, state);
  }
}
