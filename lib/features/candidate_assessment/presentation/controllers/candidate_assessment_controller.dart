import 'package:flutter/foundation.dart';

import '../../domain/entities/candidate_assessment.dart';
import '../../domain/usecases/get_assessment_answer.dart';
import '../../domain/usecases/get_candidate_assessment.dart';
import '../../domain/usecases/save_assessment_answer.dart';

class CandidateAssessmentController extends ChangeNotifier {
  CandidateAssessmentController(
    GetCandidateAssessment getAssessment,
    this._getAnswer,
    this._saveAnswer,
  ) : assessment = getAssessment(),
      _currentIndex = 3;

  final GetAssessmentAnswer _getAnswer;
  final SaveAssessmentAnswer _saveAnswer;
  final CandidateAssessment assessment;
  int _currentIndex;
  bool _isFinished = false;

  int get currentIndex => _currentIndex;
  AssessmentQuestion get currentQuestion => assessment.questions[_currentIndex];
  String? get currentAnswer => _getAnswer(currentQuestion.id);
  bool get canGoPrevious => _currentIndex > 0;
  bool get canGoNext => _currentIndex < assessment.questions.length - 1;
  bool get isFinished => _isFinished;
  int get answeredCount => assessment.questions
      .where((question) => _getAnswer(question.id) != null)
      .length;

  bool isAnswered(int index) {
    if (index < 0 || index >= assessment.questions.length) return false;
    return _getAnswer(assessment.questions[index].id) != null;
  }

  void selectAnswer(String optionId) {
    if (_isFinished || currentAnswer == optionId) return;
    _saveAnswer(currentQuestion.id, optionId);
    notifyListeners();
  }

  void selectQuestion(int index) {
    if (index < 0 || index >= assessment.questions.length) return;
    if (_currentIndex == index) return;
    _currentIndex = index;
    notifyListeners();
  }

  void previous() {
    if (canGoPrevious) selectQuestion(_currentIndex - 1);
  }

  void next() {
    if (canGoNext) selectQuestion(_currentIndex + 1);
  }

  void finish() {
    if (_isFinished) return;
    _isFinished = true;
    notifyListeners();
  }
}
