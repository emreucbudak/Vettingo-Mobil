import '../entities/candidate_assessment.dart';
import '../repositories/candidate_assessment_repository.dart';

class GetCandidateAssessment {
  const GetCandidateAssessment(this._repository);

  final CandidateAssessmentRepository _repository;

  CandidateAssessment call() => _repository.getAssessment();
}
