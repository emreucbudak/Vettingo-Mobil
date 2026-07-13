import '../repositories/candidate_assessment_repository.dart';

class SaveAssessmentAnswer {
  const SaveAssessmentAnswer(this._repository);

  final CandidateAssessmentRepository _repository;

  void call(String questionId, String optionId) {
    _repository.saveAnswer(questionId, optionId);
  }
}
