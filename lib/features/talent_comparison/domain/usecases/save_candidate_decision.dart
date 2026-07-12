import '../entities/talent_comparison.dart';
import '../repositories/talent_comparison_repository.dart';

class SaveCandidateDecision {
  const SaveCandidateDecision(this._repository);

  final TalentComparisonRepository _repository;

  void call(String candidateId, CandidateDecision decision) {
    _repository.saveDecision(candidateId, decision);
  }
}
