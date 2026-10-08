import { AppServices } from "../application/AppServices";
import { SessionUseCases } from "../application/usecases/SessionUseCases";
import { RecruitmentQueries } from "../application/usecases/RecruitmentQueries";
import { WorkspaceUseCases } from "../application/usecases/WorkspaceUseCases";
import { AsyncStorageSource } from "../data/datasources/AsyncStorageSource";
import { LocalAuthRepository } from "../data/repositories/LocalAuthRepository";
import { LocalWorkspaceRepository } from "../data/repositories/LocalWorkspaceRepository";
import { DemoRecruitmentRepository } from "../data/repositories/DemoRecruitmentRepository";
import { SystemClock } from "../infrastructure/SystemClock";
import { ExpoCvDocumentPicker } from "../infrastructure/ExpoCvDocumentPicker";
import { ReactNativeSummarySharer } from "../infrastructure/ReactNativeSummarySharer";
import { CvUseCases } from "../application/usecases/CvUseCases";
import { CandidateUseCases } from "../application/usecases/CandidateUseCases";
import { RequisitionUseCases } from "../application/usecases/RequisitionUseCases";
import { AssessmentUseCases } from "../application/usecases/AssessmentUseCases";
import { ApplicationUseCases } from "../application/usecases/ApplicationUseCases";
export function createAppServices(): AppServices {
  const storage = new AsyncStorageSource();
  const queries = new RecruitmentQueries(new DemoRecruitmentRepository());
  const clock = new SystemClock();
  return {
    queries,
    sessions: new SessionUseCases(
      new LocalAuthRepository(storage),
      new LocalWorkspaceRepository(storage),
    ),
    workspace: new WorkspaceUseCases(
      new CvUseCases(new ExpoCvDocumentPicker()),
      new CandidateUseCases(clock, new ReactNativeSummarySharer()),
      new RequisitionUseCases(clock),
      new AssessmentUseCases(queries, clock),
      new ApplicationUseCases(),
    ),
  };
}
