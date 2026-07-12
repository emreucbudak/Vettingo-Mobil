enum CandidateDecision { pending, rejected, advanced }

class TalentSkill {
  const TalentSkill({
    required this.name,
    required this.level,
    required this.score,
  }) : assert(score >= 0 && score <= 1);

  final String name;
  final String level;
  final double score;
}

class TalentCandidate {
  const TalentCandidate({
    required this.id,
    required this.name,
    required this.role,
    required this.initials,
    required this.imageUrl,
    required this.matchPercentage,
    required this.skills,
    required this.keyStrength,
  });

  final String id;
  final String name;
  final String role;
  final String initials;
  final String imageUrl;
  final int matchPercentage;
  final List<TalentSkill> skills;
  final String keyStrength;
}

class TalentComparison {
  const TalentComparison({
    required this.jobTitle,
    required this.location,
    required this.status,
    required this.benchmarkSkills,
    required this.candidates,
  });

  final String jobTitle;
  final String location;
  final String status;
  final List<String> benchmarkSkills;
  final List<TalentCandidate> candidates;
}
