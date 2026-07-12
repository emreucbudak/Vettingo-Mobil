import '../../domain/entities/talent_comparison.dart';
import '../../domain/repositories/talent_comparison_repository.dart';
import '../datasources/talent_comparison_data_source.dart';

class TalentComparisonRepositoryImpl implements TalentComparisonRepository {
  const TalentComparisonRepositoryImpl(this._dataSource);

  final TalentComparisonDataSource _dataSource;

  @override
  TalentComparison getComparison() => _dataSource.getComparison().toEntity();

  @override
  CandidateDecision getDecision(String candidateId) {
    return _dataSource.getDecision(candidateId);
  }

  @override
  void saveDecision(String candidateId, CandidateDecision decision) {
    _dataSource.saveDecision(candidateId, decision);
  }
}
