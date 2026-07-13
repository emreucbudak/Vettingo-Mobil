class CvExperience {
  const CvExperience({
    required this.role,
    required this.company,
    required this.period,
    required this.description,
  });

  final String role;
  final String company;
  final String period;
  final String description;

  CvExperience copyWith({
    String? role,
    String? company,
    String? period,
    String? description,
  }) {
    return CvExperience(
      role: role ?? this.role,
      company: company ?? this.company,
      period: period ?? this.period,
      description: description ?? this.description,
    );
  }
}

class CvEducation {
  const CvEducation({
    required this.degree,
    required this.institution,
    required this.period,
  });

  final String degree;
  final String institution;
  final String period;

  CvEducation copyWith({String? degree, String? institution, String? period}) {
    return CvEducation(
      degree: degree ?? this.degree,
      institution: institution ?? this.institution,
      period: period ?? this.period,
    );
  }
}

class CandidateCvReview {
  const CandidateCvReview({
    required this.summary,
    required this.coreSkills,
    required this.experiences,
    required this.education,
  });

  final String summary;
  final List<String> coreSkills;
  final List<CvExperience> experiences;
  final CvEducation education;

  CandidateCvReview copyWith({
    String? summary,
    List<String>? coreSkills,
    List<CvExperience>? experiences,
    CvEducation? education,
  }) {
    return CandidateCvReview(
      summary: summary ?? this.summary,
      coreSkills: coreSkills ?? this.coreSkills,
      experiences: experiences ?? this.experiences,
      education: education ?? this.education,
    );
  }
}
