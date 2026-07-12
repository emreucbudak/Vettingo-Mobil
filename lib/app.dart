import 'package:flutter/material.dart';

import 'core/di/app_dependencies.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/presentation/pages/dashboard_login_page.dart';
import 'features/dashboard/presentation/pages/candidate_dashboard_page.dart';
import 'features/dashboard/presentation/pages/employer_dashboard_page.dart';
import 'features/landing/presentation/pages/landing_page.dart';
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
      home: const LandingPage(),
      routes: {
        DashboardLoginPage.routeName: (context) => DashboardLoginPage(
          controller: dependencies.createLoginController(),
        ),
        CandidateDashboardPage.routeName: (context) => CandidateDashboardPage(
          controller: dependencies.createCandidateDashboardController(),
        ),
        EmployerDashboardPage.routeName: (context) => EmployerDashboardPage(
          controller: dependencies.createEmployerDashboardController(),
        ),
        TalentComparisonPage.routeName: (context) => TalentComparisonPage(
          controller: dependencies.createTalentComparisonController(),
        ),
      },
    );
  }
}
