import '../entities/talent_comparison.dart';
import '../repositories/talent_comparison_repository.dart';

class GetTalentComparison {
  const GetTalentComparison(this._repository);

  final TalentComparisonRepository _repository;

  TalentComparison call() => _repository.getComparison();
}
