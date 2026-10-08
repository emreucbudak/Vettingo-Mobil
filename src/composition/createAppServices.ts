import { AppServices } from "../core/application/AppServices";
import { SessionUseCases } from "../core/application/usecases/SessionUseCases";
import { WorkspaceUseCases } from "../core/application/usecases/WorkspaceUseCases";
import { LocalWorkspaceRepository } from "../core/data/repositories/LocalWorkspaceRepository";
import { AsyncStorageSource } from "../shared/data/datasources/AsyncStorageSource";
import { SystemClock } from "../shared/infrastructure/SystemClock";
import { AuthUseCases } from "../features/auth/application/usecases/AuthUseCases";
import { LocalAuthRepository } from "../features/auth/data/repositories/LocalAuthRepository";
import { JobsQueries } from "../features/jobs/application/usecases/JobsQueries";
import { DemoJobsRepository } from "../features/jobs/data/repositories/DemoJobsRepository";
import { CandidatesQueries } from "../features/candidates/application/usecases/CandidatesQueries";
import { DemoCandidatesRepository } from "../features/candidates/data/repositories/DemoCandidatesRepository";
import { AssessmentQueries } from "../features/assessment/application/usecases/AssessmentQueries";
import { DemoAssessmentRepository } from "../features/assessment/data/repositories/DemoAssessmentRepository";
import { RequisitionQueries } from "../features/requisitions/application/usecases/RequisitionQueries";
import { DemoRequisitionCatalogRepository } from "../features/requisitions/data/repositories/DemoRequisitionCatalogRepository";
import { CvUseCases } from "../features/cv/application/usecases/CvUseCases";
import { ExpoCvDocumentPicker } from "../features/cv/infrastructure/ExpoCvDocumentPicker";
import { CandidateUseCases } from "../features/candidates/application/usecases/CandidateUseCases";
import { ReactNativeSummarySharer } from "../features/candidates/infrastructure/ReactNativeSummarySharer";
import { RequisitionUseCases } from "../features/requisitions/application/usecases/RequisitionUseCases";
import { AssessmentUseCases } from "../features/assessment/application/usecases/AssessmentUseCases";
import { ApplicationUseCases } from "../features/applications/application/usecases/ApplicationUseCases";
export function createAppServices(): AppServices {
  const storage = new AsyncStorageSource(),
    clock = new SystemClock();
  const jobs = new JobsQueries(new DemoJobsRepository());
  const candidates = new CandidatesQueries(new DemoCandidatesRepository());
  const questions = new AssessmentQueries(new DemoAssessmentRepository());
  const requisitionCatalog = new RequisitionQueries(
    new DemoRequisitionCatalogRepository(),
  );
  return {
    jobs,
    candidates,
    questions,
    requisitionCatalog,
    async loadCatalogs() {
      await Promise.all([
        jobs.load(),
        candidates.load(),
        questions.load(),
        requisitionCatalog.load(),
      ]);
    },
    sessions: new SessionUseCases(
      new AuthUseCases(new LocalAuthRepository(storage)),
      new LocalWorkspaceRepository(storage),
    ),
    workspace: new WorkspaceUseCases(
      new CvUseCases(new ExpoCvDocumentPicker()),
      new CandidateUseCases(clock, new ReactNativeSummarySharer()),
      new RequisitionUseCases(clock),
      new AssessmentUseCases(questions, clock),
      new ApplicationUseCases(),
    ),
  };
}
