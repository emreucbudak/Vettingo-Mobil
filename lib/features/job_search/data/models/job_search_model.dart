import '../../domain/entities/job_search.dart';

class MarketIntelligenceModel {
  const MarketIntelligenceModel({
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

  MarketIntelligence toEntity() => MarketIntelligence(
    demandLabel: demandLabel,
    periodLabel: periodLabel,
    summary: summary,
    averageTimeToFill: averageTimeToFill,
    compensationRange: compensationRange,
  );
}

class JobMatchModel {
  const JobMatchModel({
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

  JobMatch toEntity() => JobMatch(
    id: id,
    title: title,
    company: company,
    location: location,
    salary: salary,
    matchPercentage: matchPercentage,
    tags: List.unmodifiable(tags),
  );
}

class JobSearchContentModel {
  const JobSearchContentModel({
    required this.quickFilters,
    required this.marketIntelligence,
    required this.matches,
  });

  final List<String> quickFilters;
  final MarketIntelligenceModel marketIntelligence;
  final List<JobMatchModel> matches;

  JobSearchContent toEntity() => JobSearchContent(
    quickFilters: List.unmodifiable(quickFilters),
    marketIntelligence: marketIntelligence.toEntity(),
    matches: matches.map((match) => match.toEntity()).toList(growable: false),
  );

  static const demo = JobSearchContentModel(
    quickFilters: ['Remote', 'Series B+', 'Fintech', r'$200k+'],
    marketIntelligence: MarketIntelligenceModel(
      demandLabel: 'High Demand',
      periodLabel: 'Last 30 days',
      summary:
          'Engineering leadership roles in Fintech are seeing a 14% increase in base compensation. Remote flexibility remains a top driver for candidate conversion.',
      averageTimeToFill: '42 Days',
      compensationRange: r'$180k - $240k',
    ),
    matches: [
      JobMatchModel(
        id: 'vp-engineering-acme',
        title: 'VP of Engineering',
        company: 'Acme Corp',
        location: 'Remote (US)',
        salary: r'$200k - $250k',
        matchPercentage: 95,
        tags: ['B2B SaaS', 'Series C', 'Team scaling'],
      ),
      JobMatchModel(
        id: 'director-engineering-globex',
        title: 'Director of Engineering',
        company: 'Globex',
        location: 'New York / Hybrid',
        salary: r'$180k - $220k',
        matchPercentage: 88,
        tags: ['Fintech', 'Public', 'Cloud Infrastructure'],
      ),
      JobMatchModel(
        id: 'head-platform-northstar',
        title: 'Head of Platform Engineering',
        company: 'Northstar Labs',
        location: 'Remote (Europe)',
        salary: r'$190k - $230k',
        matchPercentage: 84,
        tags: ['Series B', 'Developer Tools', 'Kubernetes'],
      ),
    ],
  );
}
