import 'package:flutter/material.dart';

import 'core/di/app_dependencies.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/presentation/pages/dashboard_login_page.dart';
import 'features/auth/presentation/pages/dashboard_register_page.dart';
import 'features/candidate_assessment/presentation/pages/candidate_assessment_page.dart';
import 'features/candidate_detail/presentation/pages/candidate_detail_page.dart';
import 'features/cv_review/presentation/pages/cv_review_page.dart';
import 'features/dashboard/presentation/pages/candidate_dashboard_page.dart';
import 'features/dashboard/presentation/pages/employer_dashboard_page.dart';
import 'features/job_search/presentation/pages/job_search_page.dart';
import 'features/new_requisition/presentation/pages/new_requisition_page.dart';
import 'features/talent_comparison/presentation/pages/talent_comparison_page.dart';

class VettingoApp extends StatelessWidget {
  const VettingoApp({super.key, this.dependencies = const AppDependencies()});

  final AppDependencies dependencies;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TalentPulse',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      home: DashboardLoginPage(
        controller: dependencies.createLoginController(),
      ),
      routes: {
        DashboardLoginPage.routeName: (context) => DashboardLoginPage(
          controller: dependencies.createLoginController(),
        ),
        DashboardRegisterPage.routeName: (context) =>
            const DashboardRegisterPage(),
        CandidateDashboardPage.routeName: (context) => CandidateDashboardPage(
          controller: dependencies.createCandidateDashboardController(),
        ),
        EmployerDashboardPage.routeName: (context) => EmployerDashboardPage(
          controller: dependencies.createEmployerDashboardController(),
        ),
        TalentComparisonPage.routeName: (context) => TalentComparisonPage(
          controller: dependencies.createTalentComparisonController(),
        ),
        CandidateAssessmentPage.routeName: (context) => CandidateAssessmentPage(
          controller: dependencies.createCandidateAssessmentController(),
        ),
        JobSearchPage.routeName: (context) =>
            JobSearchPage(controller: dependencies.createJobSearchController()),
        NewRequisitionPage.routeName: (context) => NewRequisitionPage(
          controller: dependencies.createNewRequisitionController(),
        ),
        CvReviewPage.routeName: (context) =>
            CvReviewPage(controller: dependencies.createCvReviewController()),
        CandidateDetailPage.routeName: (context) => CandidateDetailPage(
          controller: dependencies.createCandidateDetailController(),
        ),
      },
    );
  }
}
