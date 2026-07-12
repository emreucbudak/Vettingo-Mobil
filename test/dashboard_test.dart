import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vettingomobil/core/di/app_dependencies.dart';
import 'package:vettingomobil/features/dashboard/presentation/pages/candidate_dashboard_page.dart';
import 'package:vettingomobil/features/dashboard/presentation/pages/employer_dashboard_page.dart';

void main() {
  const dependencies = AppDependencies();

  test('dashboard use cases expose the local reference data', () {
    final candidate = dependencies.createCandidateDashboardController();
    final employer = dependencies.createEmployerDashboardController();

    expect(candidate.dashboard.userName, 'Alex');
    expect(candidate.dashboard.applications, hasLength(2));
    expect(candidate.dashboard.marketProfile.score, 85);
    expect(employer.dashboard.totalApplications, 1248);
    expect(employer.dashboard.topMatches.first.name, 'Sarah Jenkins');
    expect(employer.dashboard.requisitions, hasLength(3));
  });

  testWidgets('candidate dashboard renders applications and market profile', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        home: CandidateDashboardPage(
          controller: dependencies.createCandidateDashboardController(),
        ),
      ),
    );

    expect(find.text('Welcome back, Alex.'), findsOneWidget);
    expect(find.text('Active Applications'), findsOneWidget);
    expect(find.text('Senior Frontend Engineer'), findsOneWidget);
    expect(find.text('Your Market Profile'), findsOneWidget);
    expect(find.text('85'), findsOneWidget);
  });

  testWidgets('employer dashboard renders metrics and requisitions', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        home: EmployerDashboardPage(
          controller: dependencies.createEmployerDashboardController(),
        ),
      ),
    );

    expect(find.text('TOTAL APPLICATIONS'), findsOneWidget);
    expect(find.text('1,248'), findsOneWidget);
    expect(find.text('Top AI Matches'), findsOneWidget);
    expect(find.text('Sarah Jenkins'), findsOneWidget);
    expect(find.text('Active Requisitions'), findsOneWidget);
    expect(find.text('Lead Data Scientist'), findsOneWidget);
  });
}
