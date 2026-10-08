import { Session, Workspace } from "../../domain/entities/models";
import { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository";
import { AsyncStorageSource } from "../datasources/AsyncStorageSource";
import { initialWorkspace } from "../datasources/DemoWorkspaceSource";
import { restoreWorkspace } from "../mappers/workspaceMapper";
import { questions } from "../fixtures/demo";
const workspaceKey = (session: Session) =>
  `vettingo:workspace:v1:${session.role}:${session.email.toLowerCase()}`;
export class LocalWorkspaceRepository implements WorkspaceRepository {
  constructor(private readonly storage: AsyncStorageSource) {}
  create() {
    return initialWorkspace();
  }
  async load(session: Session) {
    return restoreWorkspace(
      await this.storage.read(workspaceKey(session)),
      this.create(),
      questions.length,
    );
  }
  save(session: Session, workspace: Workspace) {
    return this.storage.write(workspaceKey(session), JSON.stringify(workspace));
  }
  flush() {
    return this.storage.flush();
  }
}
