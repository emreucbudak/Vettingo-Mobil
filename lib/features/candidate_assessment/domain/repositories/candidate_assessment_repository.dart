import '../entities/candidate_assessment.dart';

abstract interface class CandidateAssessmentRepository {
  CandidateAssessment getAssessment();

  String? getAnswer(String questionId);

  void saveAnswer(String questionId, String optionId);
}
