import '../entities/candidate_dashboard.dart';
import '../repositories/dashboard_repository.dart';

class GetCandidateDashboard {
  const GetCandidateDashboard(this._repository);

  final DashboardRepository _repository;

  CandidateDashboard call() => _repository.getCandidateDashboard();
}
