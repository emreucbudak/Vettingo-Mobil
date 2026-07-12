import '../entities/employer_dashboard.dart';
import '../repositories/dashboard_repository.dart';

class GetEmployerDashboard {
  const GetEmployerDashboard(this._repository);

  final DashboardRepository _repository;

  EmployerDashboard call() => _repository.getEmployerDashboard();
}
