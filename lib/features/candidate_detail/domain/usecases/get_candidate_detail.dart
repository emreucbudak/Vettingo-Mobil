import '../entities/candidate_detail.dart';
import '../repositories/candidate_detail_repository.dart';

class GetCandidateDetail {
  const GetCandidateDetail(this._repository);

  final CandidateDetailRepository _repository;

  CandidateDetail call() => _repository.getCandidateDetail();
}
