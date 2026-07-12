import '../models/dashboard_models.dart';

abstract interface class DashboardDataSource {
  CandidateDashboardModel getCandidateDashboard();
  EmployerDashboardModel getEmployerDashboard();
}

class LocalDashboardDataSource implements DashboardDataSource {
  const LocalDashboardDataSource();

  @override
  CandidateDashboardModel getCandidateDashboard() {
    return const CandidateDashboardModel({
      'userName': 'Alex',
      'dateLabel': 'Tuesday, Oct 24',
      'summary': 'You have 2 upcoming interviews and 3 new recommended roles.',
      'applications': <Map<String, Object>>[
        {
          'role': 'Senior Frontend Engineer',
          'company': 'Stripe',
          'location': 'San Francisco',
          'status': 'Interviewing',
          'stageLabel': 'Round 2 of 4',
          'progress': .5,
          'nextStep': 'Next: Technical Assessment on Oct 26',
        },
        {
          'role': 'Staff UX Designer',
          'company': 'Airbnb',
          'location': 'Remote',
          'status': 'Applied',
          'stageLabel': 'Under Review',
          'progress': .25,
          'nextStep': 'Applied Oct 20',
        },
      ],
      'marketProfile': <String, Object>{
        'score': 85,
        'title': 'Strong Match Profile',
        'description':
            'Your React and TypeScript skills are in top 15% demand this week.',
        'skills': <String, int>{'React': 98, 'TypeScript': 92},
      },
      'recommendations': <Map<String, Object>>[
        {
          'role': 'Lead UI Developer',
          'company': 'Vercel',
          'location': 'Remote',
          'matchPercentage': 94,
          'salary': r'$160k - $210k',
        },
        {
          'role': 'Senior Software Engineer',
          'company': 'Plaid',
          'location': 'New York (Hybrid)',
          'matchPercentage': 88,
          'salary': r'$180k - $230k',
        },
      ],
    });
  }

  @override
  EmployerDashboardModel getEmployerDashboard() {
    return const EmployerDashboardModel({
      'totalApplications': 1248,
      'growthLabel': '+12%',
      'openRoles': 14,
      'aiProcessed': 842,
      'topMatches': <Map<String, Object>>[
        {
          'initials': 'SJ',
          'name': 'Sarah Jenkins',
          'role': 'Sr. Product Designer',
          'matchPercentage': 98,
          'skills': <String>['UX/UI', 'Figma', '+3'],
        },
        {
          'initials': 'MR',
          'name': 'Michael Ross',
          'role': 'Frontend Engineer',
          'matchPercentage': 94,
          'skills': <String>['React', 'TypeScript'],
        },
      ],
      'requisitions': <Map<String, Object>>[
        {
          'role': 'Lead Data Scientist',
          'status': 'Sourcing',
          'location': 'San Francisco, CA • Hybrid',
          'candidateLabel': '+12',
        },
        {
          'role': 'VP of Engineering',
          'status': 'Interviewing',
          'location': 'Remote',
          'candidateLabel': '+4',
        },
        {
          'role': 'Senior Marketing Manager',
          'status': 'Sourcing',
          'location': 'New York, NY • On-site',
          'candidateLabel': 'New',
        },
      ],
    });
  }
}
