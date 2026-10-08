import { SessionUseCases } from "./usecases/SessionUseCases";
import { RecruitmentQueries } from "./usecases/RecruitmentQueries";
import { WorkspaceUseCases } from "./usecases/WorkspaceUseCases";
export interface AppServices {
  sessions: SessionUseCases;
  queries: RecruitmentQueries;
  workspace: WorkspaceUseCases;
}
