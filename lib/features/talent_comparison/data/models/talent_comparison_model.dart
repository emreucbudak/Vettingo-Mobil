import '../../domain/entities/talent_comparison.dart';

class TalentSkillModel {
  const TalentSkillModel({
    required this.name,
    required this.level,
    required this.score,
  });

  final String name;
  final String level;
  final double score;

  TalentSkill toEntity() => TalentSkill(name: name, level: level, score: score);
}

class TalentCandidateModel {
  const TalentCandidateModel({
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
  final List<TalentSkillModel> skills;
  final String keyStrength;

  TalentCandidate toEntity() => TalentCandidate(
    id: id,
    name: name,
    role: role,
    initials: initials,
    imageUrl: imageUrl,
    matchPercentage: matchPercentage,
    skills: skills.map((skill) => skill.toEntity()).toList(growable: false),
    keyStrength: keyStrength,
  );
}

class TalentComparisonModel {
  const TalentComparisonModel({
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
  final List<TalentCandidateModel> candidates;

  TalentComparison toEntity() => TalentComparison(
    jobTitle: jobTitle,
    location: location,
    status: status,
    benchmarkSkills: List.unmodifiable(benchmarkSkills),
    candidates: candidates
        .map((candidate) => candidate.toEntity())
        .toList(growable: false),
  );

  static const demo = TalentComparisonModel(
    jobTitle: 'Senior Frontend Engineer',
    location: 'San Francisco, CA • Remote',
    status: 'Active',
    benchmarkSkills: ['React', 'System Design', 'Leadership'],
    candidates: [
      TalentCandidateModel(
        id: 'sarah-jenkins',
        name: 'Sarah Jenkins',
        role: 'Lead Engineer at TechCorp',
        initials: 'SJ',
        imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDV9ZQFMIbgYqM-t7YCqSYbPnCaU6cCzedei7Zsj1uZ0Mt28_W2w_hGfCZR0kp6nUSlJVzPv8Y49tzK9VndbncMLlNKrDtdAU8NzEVFUP-63QHBwEsU3ve2w_ZC-fvKJ6ekPURyNPqkYwpd3l8K_jAIN4zRMvoE3UF2ZIWetThY6tr582O5eCekjtaLS8cKk9qUPMsfT8ttZ0hJqXWkC4veea49zhMdqD0PxewEAejyl1nf-rkScllTUAQfjqfLNPQ6ZLzHv6D8VMw',
        matchPercentage: 94,
        skills: [
          TalentSkillModel(name: 'React', level: 'Expert', score: .95),
          TalentSkillModel(
            name: 'System Design',
            level: 'Advanced',
            score: .85,
          ),
          TalentSkillModel(name: 'Leadership', level: 'Advanced', score: .90),
        ],
        keyStrength:
            'Exceptional architectural background, particularly in scaling micro-frontends.',
      ),
      TalentCandidateModel(
        id: 'marcus-chen',
        name: 'Marcus Chen',
        role: 'Senior Dev at InnovateInc',
        initials: 'MC',
        imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuA4zmtsUDwuGPOPXmHP8YiMKDDDKXH3IUFhl3Yla842C3jp0W20XPAL15DuF1FMfR_2DWViPATSoK01mjyyVc3tiEN4Et11m2z-lvfVwbuRUyrVr8YJ66GafUr22b5Pnhve8FipamQdIDtdgch3cRK6PLGOl6xtVYXFpk5g3a_UmuvL6ZA8LcSZLHiW3KWXtwMiRFJ4l44_A5KpwaDnoNDBJkJMZwx5ev8iVULlfteHQMEgbnnT_Ta1YxtXWpXLyjuJgv8_c4wVa8E',
        matchPercentage: 88,
        skills: [
          TalentSkillModel(name: 'React', level: 'Advanced', score: .88),
          TalentSkillModel(name: 'System Design', level: 'Expert', score: .92),
          TalentSkillModel(
            name: 'Leadership',
            level: 'Intermediate',
            score: .70,
          ),
        ],
        keyStrength:
            'Strong theoretical knowledge of distributed systems and backend integration.',
      ),
      TalentCandidateModel(
        id: 'elena-rodriguez',
        name: 'Elena Rodriguez',
        role: 'Frontend Architect at WebFlow',
        initials: 'ER',
        imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAil7pQkbhscsOSnKMKWYKKD-HxHjGDQo2kKH203hdFMR4g4Cc113812_DE8HYsVkDM-gZ41xL9iahk4QOGMW-CqJdZtlZJ7hXmP8dsKDhkQVkUgW1G3XSEoEkKQaO5u74RzbeOVBGfsCbT4BQZ2HlKDiogt99VrgRqOkGnwtHiJwMmUVoDsCUdlP0rbl5K4BenjbRoKeNZClf52tbuKko9aSvRm2Ct5xjTlMV5v5wac1nXzjkanM12Uar0LxgCCOHKa9ERWpMOF0Q',
        matchPercentage: 91,
        skills: [
          TalentSkillModel(name: 'React', level: 'Expert', score: .96),
          TalentSkillModel(
            name: 'System Design',
            level: 'Intermediate',
            score: .75,
          ),
          TalentSkillModel(name: 'Leadership', level: 'Advanced', score: .88),
        ],
        keyStrength:
            'Excellent team mentor with a proven track record of upskilling junior developers.',
      ),
    ],
  );
}
