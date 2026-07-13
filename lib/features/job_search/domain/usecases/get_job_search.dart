import '../entities/job_search.dart';
import '../repositories/job_search_repository.dart';

class GetJobSearch {
  const GetJobSearch(this._repository);

  final JobSearchRepository _repository;

  JobSearchContent call() => _repository.getSearchContent();
}
