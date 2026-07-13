import '../../features/auth/data/datasources/auth_data_source.dart';
import '../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../features/auth/domain/usecases/sign_in.dart';
import '../../features/auth/presentation/controllers/login_controller.dart';
import '../../features/candidate_assessment/data/datasources/candidate_assessment_data_source.dart';
import '../../features/candidate_assessment/data/repositories/candidate_assessment_repository_impl.dart';
import '../../features/candidate_assessment/domain/usecases/get_assessment_answer.dart';
import '../../features/candidate_assessment/domain/usecases/get_candidate_assessment.dart';
import '../../features/candidate_assessment/domain/usecases/save_assessment_answer.dart';
import '../../features/candidate_assessment/presentation/controllers/candidate_assessment_controller.dart';
import '../../features/candidate_detail/data/datasources/candidate_detail_data_source.dart';
import '../../features/candidate_detail/data/repositories/candidate_detail_repository_impl.dart';
import '../../features/candidate_detail/domain/usecases/get_candidate_detail.dart';
import '../../features/candidate_detail/domain/usecases/get_candidate_pipeline_action.dart';
import '../../features/candidate_detail/domain/usecases/save_candidate_pipeline_action.dart';
import '../../features/candidate_detail/presentation/controllers/candidate_detail_controller.dart';
import '../../features/cv_review/data/datasources/cv_review_data_source.dart';
import '../../features/cv_review/data/repositories/cv_review_repository_impl.dart';
import '../../features/cv_review/domain/usecases/get_cv_review.dart';
import '../../features/cv_review/domain/usecases/save_cv_review.dart';
import '../../features/cv_review/presentation/controllers/cv_review_controller.dart';
import '../../features/dashboard/data/datasources/dashboard_data_source.dart';
import '../../features/dashboard/data/repositories/dashboard_repository_impl.dart';
import '../../features/dashboard/domain/usecases/get_candidate_dashboard.dart';
import '../../features/dashboard/domain/usecases/get_employer_dashboard.dart';
import '../../features/dashboard/presentation/controllers/candidate_dashboard_controller.dart';
import '../../features/dashboard/presentation/controllers/employer_dashboard_controller.dart';
import '../../features/job_search/data/datasources/job_search_data_source.dart';
import '../../features/job_search/data/repositories/job_search_repository_impl.dart';
import '../../features/job_search/domain/usecases/get_job_search.dart';
import '../../features/job_search/presentation/controllers/job_search_controller.dart';
import '../../features/new_requisition/data/datasources/requisition_data_source.dart';
import '../../features/new_requisition/data/repositories/requisition_repository_impl.dart';
import '../../features/new_requisition/domain/usecases/get_requisition_catalog.dart';
import '../../features/new_requisition/domain/usecases/save_requisition_draft.dart';
import '../../features/new_requisition/presentation/controllers/new_requisition_controller.dart';
import '../../features/talent_comparison/data/datasources/talent_comparison_data_source.dart';
import '../../features/talent_comparison/data/repositories/talent_comparison_repository_impl.dart';
import '../../features/talent_comparison/domain/usecases/get_candidate_decision.dart';
import '../../features/talent_comparison/domain/usecases/get_talent_comparison.dart';
import '../../features/talent_comparison/domain/usecases/save_candidate_decision.dart';
import '../../features/talent_comparison/presentation/controllers/talent_comparison_controller.dart';

class AppDependencies {
  const AppDependencies();

  LoginController createLoginController() {
    const dataSource = FakeAuthDataSource();
    const repository = AuthRepositoryImpl(dataSource);
    return LoginController(const SignIn(repository));
  }

  CandidateDashboardController createCandidateDashboardController() {
    const dataSource = LocalDashboardDataSource();
    const repository = DashboardRepositoryImpl(dataSource);
    return CandidateDashboardController(
      const GetCandidateDashboard(repository),
    );
  }

  EmployerDashboardController createEmployerDashboardController() {
    const dataSource = LocalDashboardDataSource();
    const repository = DashboardRepositoryImpl(dataSource);
    return EmployerDashboardController(const GetEmployerDashboard(repository));
  }

  TalentComparisonController createTalentComparisonController() {
    final dataSource = LocalTalentComparisonDataSource();
    final repository = TalentComparisonRepositoryImpl(dataSource);
    return TalentComparisonController(
      GetTalentComparison(repository),
      GetCandidateDecision(repository),
      SaveCandidateDecision(repository),
    );
  }

  CandidateAssessmentController createCandidateAssessmentController() {
    final dataSource = LocalCandidateAssessmentDataSource();
    final repository = CandidateAssessmentRepositoryImpl(dataSource);
    return CandidateAssessmentController(
      GetCandidateAssessment(repository),
      GetAssessmentAnswer(repository),
      SaveAssessmentAnswer(repository),
    );
  }

  JobSearchController createJobSearchController() {
    const dataSource = LocalJobSearchDataSource();
    const repository = JobSearchRepositoryImpl(dataSource);
    return JobSearchController(const GetJobSearch(repository));
  }

  NewRequisitionController createNewRequisitionController() {
    final dataSource = LocalRequisitionDataSource();
    final repository = RequisitionRepositoryImpl(dataSource);
    return NewRequisitionController(
      GetRequisitionCatalog(repository),
      SaveRequisitionDraft(repository),
    );
  }

  CvReviewController createCvReviewController() {
    final dataSource = LocalCvReviewDataSource();
    final repository = CvReviewRepositoryImpl(dataSource);
    return CvReviewController(
      GetCvReview(repository),
      SaveCvReview(repository),
    );
  }

  CandidateDetailController createCandidateDetailController() {
    final dataSource = LocalCandidateDetailDataSource();
    final repository = CandidateDetailRepositoryImpl(dataSource);
    return CandidateDetailController(
      GetCandidateDetail(repository),
      GetCandidatePipelineAction(repository),
      SaveCandidatePipelineAction(repository),
    );
  }
}
