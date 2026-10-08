import { SessionUseCases } from "./usecases/SessionUseCases";
import { WorkspaceUseCases } from "./usecases/WorkspaceUseCases";
import { JobsQueries } from "../../features/jobs/application/usecases/JobsQueries";
import { CandidatesQueries } from "../../features/candidates/application/usecases/CandidatesQueries";
import { AssessmentQueries } from "../../features/assessment/application/usecases/AssessmentQueries";
import { RequisitionQueries } from "../../features/requisitions/application/usecases/RequisitionQueries";
export interface AppServices {
  sessions: SessionUseCases;
  workspace: WorkspaceUseCases;
  jobs: JobsQueries;
  candidates: CandidatesQueries;
  questions: AssessmentQueries;
  requisitionCatalog: RequisitionQueries;
  loadCatalogs(): Promise<void>;
}
