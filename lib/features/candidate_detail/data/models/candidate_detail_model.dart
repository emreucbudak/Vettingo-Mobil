import '../../domain/entities/candidate_detail.dart';

class CandidateRequirementModel {
  const CandidateRequirementModel({required this.name, required this.result});

  final String name;
  final String result;

  CandidateRequirement toEntity() =>
      CandidateRequirement(name: name, result: result);
}

class CandidateProfessionalExperienceModel {
  const CandidateProfessionalExperienceModel({
    required this.role,
    required this.company,
    required this.period,
    required this.description,
  });

  final String role;
  final String company;
  final String period;
  final String description;

  CandidateProfessionalExperience toEntity() => CandidateProfessionalExperience(
    role: role,
    company: company,
    period: period,
    description: description,
  );
}

class CandidateEducationModel {
  const CandidateEducationModel({
    required this.title,
    required this.institution,
    required this.period,
  });

  final String title;
  final String institution;
  final String period;

  CandidateEducation toEntity() => CandidateEducation(
    title: title,
    institution: institution,
    period: period,
  );
}

class CandidateDetailModel {
  const CandidateDetailModel({
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
  final List<CandidateRequirementModel> requirements;
  final List<CandidateProfessionalExperienceModel> experiences;
  final List<CandidateEducationModel> education;

  CandidateDetail toEntity() => CandidateDetail(
    id: id,
    name: name,
    initials: initials,
    currentRole: currentRole,
    status: status,
    matchPercentage: matchPercentage,
    executiveSummary: executiveSummary,
    requirements: requirements
        .map((requirement) => requirement.toEntity())
        .toList(growable: false),
    experiences: experiences
        .map((experience) => experience.toEntity())
        .toList(growable: false),
    education: education
        .map((education) => education.toEntity())
        .toList(growable: false),
  );

  static const demo = CandidateDetailModel(
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    initials: 'SJ',
    currentRole: 'VP of Engineering at CloudScale Inc.',
    status: 'Actively Interviewing',
    matchPercentage: 92,
    executiveSummary:
        'Sarah demonstrates exceptional technical leadership, having scaled engineering orgs from 50 to 200+ while maintaining high delivery velocity. Her background in distributed systems perfectly aligns with our Q3 infrastructure overhaul requirements. Flight risk is low, and compensation expectations are within the approved band.',
    requirements: [
      CandidateRequirementModel(name: 'Distributed Systems', result: 'EXCEEDS'),
      CandidateRequirementModel(name: 'Team Scaling', result: 'EXCEEDS'),
      CandidateRequirementModel(name: 'Budget Management', result: 'MEETS'),
    ],
    experiences: [
      CandidateProfessionalExperienceModel(
        role: 'VP of Engineering',
        company: 'CloudScale Inc.',
        period: '2020 - Present',
        description:
            'Led a team of 150+ engineers across 4 global offices. Architected migration to microservices, reducing deployment time by 40%.',
      ),
      CandidateProfessionalExperienceModel(
        role: 'Director of Engineering',
        company: 'DataFlow Systems',
        period: '2016 - 2020',
        description:
            'Managed core data pipeline infrastructure. Grew team from 10 to 45.',
      ),
    ],
    education: [
      CandidateEducationModel(
        title: 'M.S. Computer Science',
        institution: 'Stanford University',
        period: '2014 - 2016',
      ),
      CandidateEducationModel(
        title: 'AWS Certified Solutions Architect',
        institution: 'Amazon Web Services',
        period: '2019',
      ),
    ],
  );
}
