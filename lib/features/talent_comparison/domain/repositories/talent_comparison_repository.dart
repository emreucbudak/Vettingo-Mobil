import '../entities/talent_comparison.dart';

abstract interface class TalentComparisonRepository {
  TalentComparison getComparison();

  CandidateDecision getDecision(String candidateId);

  void saveDecision(String candidateId, CandidateDecision decision);
}
