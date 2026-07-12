import '../entities/candidate_dashboard.dart';
import '../entities/employer_dashboard.dart';

abstract interface class DashboardRepository {
  CandidateDashboard getCandidateDashboard();
  EmployerDashboard getEmployerDashboard();
}
