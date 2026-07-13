import '../models/job_search_model.dart';

abstract interface class JobSearchDataSource {
  JobSearchContentModel getSearchContent();
}

class LocalJobSearchDataSource implements JobSearchDataSource {
  const LocalJobSearchDataSource();

  @override
  JobSearchContentModel getSearchContent() => JobSearchContentModel.demo;
}
