import { Session, Workspace } from "../entities/models";
export interface WorkspaceRepository {
  create(): Workspace;
  load(session: Session): Promise<Workspace>;
  save(session: Session, workspace: Workspace): Promise<void>;
  flush(): Promise<void>;
}
