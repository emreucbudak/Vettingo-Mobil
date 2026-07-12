import '../../domain/entities/candidate_dashboard.dart';
import '../../domain/usecases/get_candidate_dashboard.dart';

class CandidateDashboardController {
  CandidateDashboardController(GetCandidateDashboard getDashboard)
    : dashboard = getDashboard();

  final CandidateDashboard dashboard;
}
