import '../entities/talent_comparison.dart';
import '../repositories/talent_comparison_repository.dart';

class GetCandidateDecision {
  const GetCandidateDecision(this._repository);

  final TalentComparisonRepository _repository;

  CandidateDecision call(String candidateId) {
    return _repository.getDecision(candidateId);
  }
}
