import '../models/candidate_assessment_model.dart';

abstract interface class CandidateAssessmentDataSource {
  CandidateAssessmentModel getAssessment();

  String? getAnswer(String questionId);

  void saveAnswer(String questionId, String optionId);
}

class LocalCandidateAssessmentDataSource
    implements CandidateAssessmentDataSource {
  final Map<String, String> _answers = {
    'react-effects': 'dependency-array',
    'dart-immutability': 'final',
    'flutter-build': 'init-state',
    'current-question': 'userdata-loop',
  };

  @override
  CandidateAssessmentModel getAssessment() => CandidateAssessmentModel.demo;

  @override
  String? getAnswer(String questionId) => _answers[questionId];

  @override
  void saveAnswer(String questionId, String optionId) {
    _answers[questionId] = optionId;
  }
}
