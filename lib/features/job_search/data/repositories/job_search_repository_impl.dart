import '../../domain/entities/job_search.dart';
import '../../domain/repositories/job_search_repository.dart';
import '../datasources/job_search_data_source.dart';

class JobSearchRepositoryImpl implements JobSearchRepository {
  const JobSearchRepositoryImpl(this._dataSource);

  final JobSearchDataSource _dataSource;

  @override
  JobSearchContent getSearchContent() =>
      _dataSource.getSearchContent().toEntity();
}
