import '../repositories/candidate_assessment_repository.dart';

class GetAssessmentAnswer {
  const GetAssessmentAnswer(this._repository);

  final CandidateAssessmentRepository _repository;

  String? call(String questionId) => _repository.getAnswer(questionId);
}
