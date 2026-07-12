import '../../domain/entities/talent_comparison.dart';
import '../models/talent_comparison_model.dart';

abstract interface class TalentComparisonDataSource {
  TalentComparisonModel getComparison();

  CandidateDecision getDecision(String candidateId);

  void saveDecision(String candidateId, CandidateDecision decision);
}

class LocalTalentComparisonDataSource implements TalentComparisonDataSource {
  final Map<String, CandidateDecision> _decisions = {};

  @override
  TalentComparisonModel getComparison() => TalentComparisonModel.demo;

  @override
  CandidateDecision getDecision(String candidateId) {
    return _decisions[candidateId] ?? CandidateDecision.pending;
  }

  @override
  void saveDecision(String candidateId, CandidateDecision decision) {
    _decisions[candidateId] = decision;
  }
}
