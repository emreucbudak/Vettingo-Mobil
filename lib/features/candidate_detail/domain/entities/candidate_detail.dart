enum CandidatePipelineAction { none, interviewScheduled, advanced }

class CandidateRequirement {
  const CandidateRequirement({required this.name, required this.result});

  final String name;
  final String result;
}

class CandidateProfessionalExperience {
  const CandidateProfessionalExperience({
    required this.role,
    required this.company,
    required this.period,
    required this.description,
  });

  final String role;
  final String company;
  final String period;
  final String description;
}

class CandidateEducation {
  const CandidateEducation({
    required this.title,
    required this.institution,
    required this.period,
  });

  final String title;
  final String institution;
  final String period;
}

class CandidateDetail {
  const CandidateDetail({
    required this.id,
    required this.name,
    required this.initials,
    required this.currentRole,
    required this.status,
    required this.matchPercentage,
    required this.executiveSummary,
    required this.requirements,
    required this.experiences,
    required this.education,
  });

  final String id;
  final String name;
  final String initials;
  final String currentRole;
  final String status;
  final int matchPercentage;
  final String executiveSummary;
  final List<CandidateRequirement> requirements;
  final List<CandidateProfessionalExperience> experiences;
  final List<CandidateEducation> education;
}
