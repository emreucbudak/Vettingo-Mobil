import '../entities/job_search.dart';

abstract interface class JobSearchRepository {
  JobSearchContent getSearchContent();
}
