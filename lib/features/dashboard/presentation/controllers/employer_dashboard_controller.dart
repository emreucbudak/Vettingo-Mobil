import '../../domain/entities/employer_dashboard.dart';
import '../../domain/usecases/get_employer_dashboard.dart';

class EmployerDashboardController {
  EmployerDashboardController(GetEmployerDashboard getDashboard)
    : dashboard = getDashboard();

  final EmployerDashboard dashboard;
}
