class CandidateDashboard {
  const CandidateDashboard({
    required this.userName,
    required this.dateLabel,
    required this.summary,
    required this.applications,
    required this.applicationHistory,
    required this.marketProfile,
    required this.recommendations,
  });

  final String userName;
  final String dateLabel;
  final String summary;
  final List<JobApplication> applications;
  final List<JobApplication> applicationHistory;
  final MarketProfile marketProfile;
  final List<JobRecommendation> recommendations;
}

class JobApplication {
  const JobApplication({
    required this.role,
    required this.company,
    required this.location,
    required this.status,
    required this.stageLabel,
    required this.progress,
    required this.nextStep,
  });

  final String role;
  final String company;
  final String location;
  final String status;
  final String stageLabel;
  final double progress;
  final String nextStep;
}

class MarketProfile {
  const MarketProfile({
    required this.score,
    required this.title,
    required this.description,
    required this.skills,
  });

  final int score;
  final String title;
  final String description;
  final Map<String, int> skills;
}

class JobRecommendation {
  const JobRecommendation({
    required this.role,
    required this.company,
    required this.location,
    required this.matchPercentage,
    required this.salary,
  });

  final String role;
  final String company;
  final String location;
  final int matchPercentage;
  final String salary;
}
