import '../entities/candidate_detail.dart';

abstract interface class CandidateDetailRepository {
  CandidateDetail getCandidateDetail();

  CandidatePipelineAction getPipelineAction(String candidateId);

  DateTime? getScheduledDate(String candidateId);

  void savePipelineAction(
    String candidateId,
    CandidatePipelineAction action, {
    DateTime? scheduledDate,
  });
}
