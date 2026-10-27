import { AppServices } from "../core/application/AppServices";
import { SessionUseCases } from "../core/application/usecases/SessionUseCases";
import { WorkspaceUseCases } from "../core/application/usecases/WorkspaceUseCases";
import { LocalWorkspaceRepository } from "../core/data/repositories/LocalWorkspaceRepository";
import { AsyncStorageSource } from "../shared/data/datasources/AsyncStorageSource";
import { SystemClock } from "../shared/infrastructure/SystemClock";
import { AuthUseCases } from "../features/auth/application/usecases/AuthUseCases";
import { LocalAuthRepository } from "../features/auth/data/repositories/LocalAuthRepository";
import { JobsQueries } from "../features/jobs/application/usecases/JobsQueries";
import { PersonalizedJobsQueries } from "../features/jobs/application/usecases/PersonalizedJobsQueries";
import { ApiPersonalizedJobsRepository } from "../features/jobs/data/repositories/ApiPersonalizedJobsRepository";
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
import { NotificationQueries } from "../features/account/application/usecases/NotificationQueries";
import { ApiNotificationsRepository } from "../features/account/data/repositories/ApiNotificationsRepository";
import { CvQueries } from "../features/cv/application/usecases/CvQueries";
import { ApiCvRepository } from "../features/cv/data/repositories/ApiCvRepository";
export function createAppServices(): AppServices {
  const storage = new AsyncStorageSource(),
    clock = new SystemClock();
  const jobsRepository = new DemoJobsRepository();
  const candidatesRepository = new DemoCandidatesRepository();
  const assessmentRepository = new DemoAssessmentRepository();
  const requisitionRepository = new DemoRequisitionCatalogRepository();
  // Bundled demo data is available immediately for screen design and navigation.
  const jobs = new JobsQueries(jobsRepository, jobsRepository.snapshot());
  const candidates = new CandidatesQueries(
    candidatesRepository,
    candidatesRepository.snapshot(),
  );
  const questions = new AssessmentQueries(
    assessmentRepository,
    assessmentRepository.snapshot(),
  );
  const requisitionCatalog = new RequisitionQueries(
    requisitionRepository,
    requisitionRepository.snapshot(),
  );
  return {
    personalizedJobs: new PersonalizedJobsQueries(
      new ApiPersonalizedJobsRepository(
        (input, init) => fetch(input, init),
        process.env.EXPO_PUBLIC_JOB_API_URL,
      ),
    ),
    cv: new CvQueries(new ApiCvRepository((input, init) => fetch(input, init))),
    notifications: new NotificationQueries(
      new ApiNotificationsRepository((input, init) => fetch(input, init)),
    ),
    jobs,
    candidates,
    questions,
    requisitionCatalog,
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
