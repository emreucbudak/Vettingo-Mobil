import { AuthenticationInput, Session } from "../../domain/entities/models";
import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository";
import { validateAuth } from "../../domain/policies/recruitment";
export class SessionUseCases {
  constructor(
    private readonly auth: AuthRepository,
    private readonly workspace: WorkspaceRepository,
  ) {}
  validate(input: AuthenticationInput) {
    return validateAuth(input, input.register, input.role);
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
