import { SessionUseCases } from "./usecases/SessionUseCases";
import { WorkspaceUseCases } from "./usecases/WorkspaceUseCases";
import { JobsQueries } from "../../features/jobs/application/usecases/JobsQueries";
import { PersonalizedJobsQueries } from "../../features/jobs/application/usecases/PersonalizedJobsQueries";
import { CandidatesQueries } from "../../features/candidates/application/usecases/CandidatesQueries";
import { AssessmentQueries } from "../../features/assessment/application/usecases/AssessmentQueries";
import { RequisitionQueries } from "../../features/requisitions/application/usecases/RequisitionQueries";
import { NotificationQueries } from "../../features/account/application/usecases/NotificationQueries";
import { CvQueries } from "../../features/cv/application/usecases/CvQueries";
export interface AppServices {
  sessions: SessionUseCases;
  workspace: WorkspaceUseCases;
  jobs: JobsQueries;
  personalizedJobs: PersonalizedJobsQueries;
  candidates: CandidatesQueries;
  questions: AssessmentQueries;
  requisitionCatalog: RequisitionQueries;
  notifications: NotificationQueries;
  cv: CvQueries;
}
