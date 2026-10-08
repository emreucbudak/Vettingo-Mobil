import { Session } from "../../../features/auth/domain/entities/Session";
import { Workspace } from "../entities/Workspace";
export interface WorkspaceRepository {
  create(): Workspace;
  load(session: Session): Promise<Workspace>;
  save(session: Session, workspace: Workspace): Promise<void>;
  flush(): Promise<void>;
}
