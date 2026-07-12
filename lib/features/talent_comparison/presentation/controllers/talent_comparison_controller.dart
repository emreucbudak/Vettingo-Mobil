import 'package:flutter/foundation.dart';

import '../../domain/entities/talent_comparison.dart';
import '../../domain/usecases/get_candidate_decision.dart';
import '../../domain/usecases/get_talent_comparison.dart';
import '../../domain/usecases/save_candidate_decision.dart';

class TalentComparisonController extends ChangeNotifier {
  TalentComparisonController(
    GetTalentComparison getTalentComparison,
    this._getCandidateDecision,
    this._saveCandidateDecision,
  ) : comparison = getTalentComparison();

  final GetCandidateDecision _getCandidateDecision;
  final SaveCandidateDecision _saveCandidateDecision;
  final TalentComparison comparison;
  int _currentIndex = 0;

  int get currentIndex => _currentIndex;
  TalentCandidate get currentCandidate => comparison.candidates[_currentIndex];
  CandidateDecision get currentDecision => decisionFor(currentCandidate);

  CandidateDecision decisionFor(TalentCandidate candidate) {
    return _getCandidateDecision(candidate.id);
  }

  void selectCandidate(int index) {
    if (index < 0 || index >= comparison.candidates.length) return;
    if (_currentIndex == index) return;
    _currentIndex = index;
    notifyListeners();
  }

  void rejectCurrent() {
    _setCurrentDecision(CandidateDecision.rejected);
  }

  void advanceCurrent() {
    _setCurrentDecision(CandidateDecision.advanced);
  }

  void _setCurrentDecision(CandidateDecision decision) {
    if (currentDecision == decision) return;
    _saveCandidateDecision(currentCandidate.id, decision);
    notifyListeners();
  }
}
