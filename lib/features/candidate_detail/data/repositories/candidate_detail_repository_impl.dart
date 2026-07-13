import '../../domain/entities/candidate_detail.dart';
import '../../domain/repositories/candidate_detail_repository.dart';
import '../datasources/candidate_detail_data_source.dart';

class CandidateDetailRepositoryImpl implements CandidateDetailRepository {
  const CandidateDetailRepositoryImpl(this._dataSource);

  final CandidateDetailDataSource _dataSource;

  @override
  CandidateDetail getCandidateDetail() {
    return _dataSource.getCandidateDetail().toEntity();
  }

  @override
  CandidatePipelineAction getPipelineAction(String candidateId) {
    return _dataSource.getPipelineAction(candidateId);
  }

  @override
  DateTime? getScheduledDate(String candidateId) {
    return _dataSource.getScheduledDate(candidateId);
  }

  @override
  void savePipelineAction(
    String candidateId,
    CandidatePipelineAction action, {
    DateTime? scheduledDate,
  }) {
    _dataSource.savePipelineAction(
      candidateId,
      action,
      scheduledDate: scheduledDate,
    );
  }
}
