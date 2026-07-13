import '../entities/candidate_detail.dart';
import '../repositories/candidate_detail_repository.dart';

class SaveCandidatePipelineAction {
  const SaveCandidatePipelineAction(this._repository);

  final CandidateDetailRepository _repository;

  void call(
    String candidateId,
    CandidatePipelineAction action, {
    DateTime? scheduledDate,
  }) {
    _repository.savePipelineAction(
      candidateId,
      action,
      scheduledDate: scheduledDate,
    );
  }
}
