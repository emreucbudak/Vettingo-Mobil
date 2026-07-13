enum WorkLocationType { remote, hybrid, onSite }

extension WorkLocationTypeLabel on WorkLocationType {
  String get label => switch (this) {
    WorkLocationType.remote => 'Remote',
    WorkLocationType.hybrid => 'Hybrid',
    WorkLocationType.onSite => 'On-site',
  };

  String get description => switch (this) {
    WorkLocationType.remote => 'Hire from anywhere',
    WorkLocationType.hybrid => 'Mix of office and remote',
    WorkLocationType.onSite => 'Must be in office',
  };
}

class RequisitionCatalog {
  const RequisitionCatalog({
    required this.departments,
    required this.offices,
    required this.suggestedSkills,
    required this.marketRange,
    required this.marketLabel,
    required this.percentile25,
    required this.median,
    required this.percentile75,
  });

  final List<String> departments;
  final List<String> offices;
  final List<String> suggestedSkills;
  final String marketRange;
  final String marketLabel;
  final String percentile25;
  final String median;
  final String percentile75;
}

class RequisitionDraft {
  const RequisitionDraft({
    required this.jobTitle,
    required this.department,
    required this.locationType,
    required this.office,
    required this.skills,
    required this.useMarketCompensation,
  });

  final String jobTitle;
  final String department;
  final WorkLocationType locationType;
  final String? office;
  final List<String> skills;
  final bool useMarketCompensation;
}
