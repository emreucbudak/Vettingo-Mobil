class MarketIntelligence {
  const MarketIntelligence({
    required this.demandLabel,
    required this.periodLabel,
    required this.summary,
    required this.averageTimeToFill,
    required this.compensationRange,
  });

  final String demandLabel;
  final String periodLabel;
  final String summary;
  final String averageTimeToFill;
  final String compensationRange;
}

class JobMatch {
  const JobMatch({
    required this.id,
    required this.title,
    required this.company,
    required this.location,
    required this.salary,
    required this.matchPercentage,
    required this.tags,
  });

  final String id;
  final String title;
  final String company;
  final String location;
  final String salary;
  final int matchPercentage;
  final List<String> tags;

  bool matches(String query, Set<String> filters) {
    final haystack = [
      title,
      company,
      location,
      salary,
      ...tags,
    ].join(' ').toLowerCase();
    final queryMatches = query
        .trim()
        .toLowerCase()
        .split(RegExp(r'\s+'))
        .where((word) => word.isNotEmpty)
        .every(haystack.contains);
    final filtersMatch = filters.every((filter) {
      final normalized = filter.toLowerCase();
      if (normalized == r'$200k+') {
        return salary.contains(r'$200k') || salary.contains(r'$250k');
      }
      if (normalized == 'series b+') {
        return tags.any((tag) => tag.toLowerCase().startsWith('series'));
      }
      return haystack.contains(normalized);
    });
    return queryMatches && filtersMatch;
  }
}

class JobSearchContent {
  const JobSearchContent({
    required this.quickFilters,
    required this.marketIntelligence,
    required this.matches,
  });

  final List<String> quickFilters;
  final MarketIntelligence marketIntelligence;
  final List<JobMatch> matches;
}
