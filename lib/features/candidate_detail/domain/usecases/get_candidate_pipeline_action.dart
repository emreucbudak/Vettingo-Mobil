import '../entities/candidate_detail.dart';
import '../repositories/candidate_detail_repository.dart';

class GetCandidatePipelineAction {
  const GetCandidatePipelineAction(this._repository);

  final CandidateDetailRepository _repository;

  CandidatePipelineAction call(String candidateId) {
    return _repository.getPipelineAction(candidateId);
  }

  DateTime? scheduledDate(String candidateId) {
    return _repository.getScheduledDate(candidateId);
  }
}
