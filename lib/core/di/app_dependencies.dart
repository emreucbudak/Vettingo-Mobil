import '../../features/auth/data/datasources/auth_data_source.dart';
import '../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../features/auth/domain/usecases/sign_in.dart';
import '../../features/auth/presentation/controllers/login_controller.dart';
import '../../features/dashboard/data/datasources/dashboard_data_source.dart';
import '../../features/dashboard/data/repositories/dashboard_repository_impl.dart';
import '../../features/dashboard/domain/usecases/get_candidate_dashboard.dart';
import '../../features/dashboard/domain/usecases/get_employer_dashboard.dart';
import '../../features/dashboard/presentation/controllers/candidate_dashboard_controller.dart';
import '../../features/dashboard/presentation/controllers/employer_dashboard_controller.dart';
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
}
