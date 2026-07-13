import '../../domain/entities/candidate_detail.dart';
import '../models/candidate_detail_model.dart';

abstract interface class CandidateDetailDataSource {
  CandidateDetailModel getCandidateDetail();

  CandidatePipelineAction getPipelineAction(String candidateId);

  DateTime? getScheduledDate(String candidateId);

  void savePipelineAction(
    String candidateId,
    CandidatePipelineAction action, {
    DateTime? scheduledDate,
  });
}

class LocalCandidateDetailDataSource implements CandidateDetailDataSource {
  final Map<String, CandidatePipelineAction> _actions = {};
  final Map<String, DateTime> _scheduledDates = {};

  @override
  CandidateDetailModel getCandidateDetail() => CandidateDetailModel.demo;

  @override
  CandidatePipelineAction getPipelineAction(String candidateId) {
    return _actions[candidateId] ?? CandidatePipelineAction.none;
  }

  @override
  DateTime? getScheduledDate(String candidateId) {
    return _scheduledDates[candidateId];
  }

  @override
  void savePipelineAction(
    String candidateId,
    CandidatePipelineAction action, {
    DateTime? scheduledDate,
  }) {
    _actions[candidateId] = action;
    if (scheduledDate == null) {
      _scheduledDates.remove(candidateId);
    } else {
      _scheduledDates[candidateId] = scheduledDate;
    }
  }
}
