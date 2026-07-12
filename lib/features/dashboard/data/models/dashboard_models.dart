import '../../domain/entities/candidate_dashboard.dart';
import '../../domain/entities/employer_dashboard.dart';

class CandidateDashboardModel {
  const CandidateDashboardModel(this.json);

  final Map<String, Object> json;

  CandidateDashboard toEntity() {
    final applications = (json['applications']! as List<Map<String, Object>>)
        .map(
          (item) => JobApplication(
            role: item['role']! as String,
            company: item['company']! as String,
            location: item['location']! as String,
            status: item['status']! as String,
            stageLabel: item['stageLabel']! as String,
            progress: item['progress']! as double,
            nextStep: item['nextStep']! as String,
          ),
        )
        .toList(growable: false);
    final profile = json['marketProfile']! as Map<String, Object>;
    final recommendations =
        (json['recommendations']! as List<Map<String, Object>>)
            .map(
              (item) => JobRecommendation(
                role: item['role']! as String,
                company: item['company']! as String,
                location: item['location']! as String,
                matchPercentage: item['matchPercentage']! as int,
                salary: item['salary']! as String,
              ),
            )
            .toList(growable: false);
    return CandidateDashboard(
      userName: json['userName']! as String,
      dateLabel: json['dateLabel']! as String,
      summary: json['summary']! as String,
      applications: applications,
      marketProfile: MarketProfile(
        score: profile['score']! as int,
        title: profile['title']! as String,
        description: profile['description']! as String,
        skills: Map<String, int>.from(profile['skills']! as Map),
      ),
      recommendations: recommendations,
    );
  }
}

class EmployerDashboardModel {
  const EmployerDashboardModel(this.json);

  final Map<String, Object> json;

  EmployerDashboard toEntity() {
    final matches = (json['topMatches']! as List<Map<String, Object>>)
        .map(
          (item) => TalentMatch(
            initials: item['initials']! as String,
            name: item['name']! as String,
            role: item['role']! as String,
            matchPercentage: item['matchPercentage']! as int,
            skills: List<String>.from(item['skills']! as List),
          ),
        )
        .toList(growable: false);
    final requisitions = (json['requisitions']! as List<Map<String, Object>>)
        .map(
          (item) => JobRequisition(
            role: item['role']! as String,
            status: item['status']! as String,
            location: item['location']! as String,
            candidateLabel: item['candidateLabel']! as String,
          ),
        )
        .toList(growable: false);
    return EmployerDashboard(
      totalApplications: json['totalApplications']! as int,
      growthLabel: json['growthLabel']! as String,
      openRoles: json['openRoles']! as int,
      aiProcessed: json['aiProcessed']! as int,
      topMatches: matches,
      requisitions: requisitions,
    );
  }
}
