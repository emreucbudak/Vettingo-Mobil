import '../../domain/entities/candidate_cv_review.dart';

class CvExperienceModel {
  const CvExperienceModel({
    required this.role,
    required this.company,
    required this.period,
    required this.description,
  });

  final String role;
  final String company;
  final String period;
  final String description;

  CvExperience toEntity() => CvExperience(
    role: role,
    company: company,
    period: period,
    description: description,
  );
}

class CvEducationModel {
  const CvEducationModel({
    required this.degree,
    required this.institution,
    required this.period,
  });

  final String degree;
  final String institution;
  final String period;

  CvEducation toEntity() =>
      CvEducation(degree: degree, institution: institution, period: period);
}

class CandidateCvReviewModel {
  const CandidateCvReviewModel({
    required this.summary,
    required this.coreSkills,
    required this.experiences,
    required this.education,
  });

  final String summary;
  final List<String> coreSkills;
  final List<CvExperienceModel> experiences;
  final CvEducationModel education;

  CandidateCvReview toEntity() => CandidateCvReview(
    summary: summary,
    coreSkills: List.unmodifiable(coreSkills),
    experiences: experiences
        .map((experience) => experience.toEntity())
        .toList(growable: false),
    education: education.toEntity(),
  );

  static const demo = CandidateCvReviewModel(
    summary:
        'Senior Full Stack Developer with 8+ years of experience building scalable enterprise web applications. Proficient in React, Node.js, and cloud infrastructure. Strong leadership skills demonstrated by guiding a team of 5 engineers to successfully deliver a major SaaS platform migration.',
    coreSkills: [
      'React.js',
      'Node.js',
      'TypeScript',
      'AWS',
      'System Architecture',
      'Team Leadership',
    ],
    experiences: [
      CvExperienceModel(
        role: 'Lead Developer',
        company: 'TechCorp Solutions Inc.',
        period: '2020 - Present',
        description:
            'Architected and implemented microservices transition. Managed technical debt reduction initiatives.',
      ),
      CvExperienceModel(
        role: 'Senior Developer',
        company: 'InnovateWeb Ltd.',
        period: '2017 - 2020',
        description:
            'Led frontend development using React. Improved application load times by 40%.',
      ),
    ],
    education: CvEducationModel(
      degree: 'BSc Computer Science',
      institution: 'University of Technology',
      period: '2013 - 2017',
    ),
  );
}
