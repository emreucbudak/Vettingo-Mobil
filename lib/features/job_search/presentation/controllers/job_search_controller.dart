import 'package:flutter/foundation.dart';

import '../../domain/entities/job_search.dart';
import '../../domain/usecases/get_job_search.dart';

class JobSearchController extends ChangeNotifier {
  JobSearchController(GetJobSearch getJobSearch) : content = getJobSearch();

  final JobSearchContent content;
  String _query = '';
  final Set<String> _activeFilters = {'Remote'};

  String get query => _query;
  Set<String> get activeFilters => Set.unmodifiable(_activeFilters);
  List<JobMatch> get visibleMatches => content.matches
      .where((match) => match.matches(_query, _activeFilters))
      .toList(growable: false);

  void updateQuery(String value) {
    if (_query == value) return;
    _query = value;
    notifyListeners();
  }

  bool isFilterActive(String filter) => _activeFilters.contains(filter);

  void toggleFilter(String filter) {
    if (!_activeFilters.remove(filter)) _activeFilters.add(filter);
    notifyListeners();
  }

  void clearFilters() {
    if (_activeFilters.isEmpty) return;
    _activeFilters.clear();
    notifyListeners();
  }
}
