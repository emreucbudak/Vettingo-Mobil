import '../../domain/entities/candidate_dashboard.dart';
import '../../domain/entities/employer_dashboard.dart';
import '../../domain/repositories/dashboard_repository.dart';
import '../datasources/dashboard_data_source.dart';

class DashboardRepositoryImpl implements DashboardRepository {
  const DashboardRepositoryImpl(this._dataSource);

  final DashboardDataSource _dataSource;

  @override
  CandidateDashboard getCandidateDashboard() {
    return _dataSource.getCandidateDashboard().toEntity();
  }

  @override
  EmployerDashboard getEmployerDashboard() {
    return _dataSource.getEmployerDashboard().toEntity();
  }
}
