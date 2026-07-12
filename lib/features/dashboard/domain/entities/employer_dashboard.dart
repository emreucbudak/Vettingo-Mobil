class EmployerDashboard {
  const EmployerDashboard({
    required this.totalApplications,
    required this.growthLabel,
    required this.openRoles,
    required this.aiProcessed,
    required this.topMatches,
    required this.requisitions,
  });

  final int totalApplications;
  final String growthLabel;
  final int openRoles;
  final int aiProcessed;
  final List<TalentMatch> topMatches;
  final List<JobRequisition> requisitions;
}

class TalentMatch {
  const TalentMatch({
    required this.initials,
    required this.name,
    required this.role,
    required this.matchPercentage,
    required this.skills,
  });

  final String initials;
  final String name;
  final String role;
  final int matchPercentage;
  final List<String> skills;
}

class JobRequisition {
  const JobRequisition({
    required this.role,
    required this.status,
    required this.location,
    required this.candidateLabel,
  });

  final String role;
  final String status;
  final String location;
  final String candidateLabel;
}
