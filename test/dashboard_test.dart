import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vettingomobil/core/di/app_dependencies.dart';
import 'package:vettingomobil/core/widgets/talent_pulse_shell.dart';
import 'package:vettingomobil/features/dashboard/presentation/pages/candidate_dashboard_page.dart';
import 'package:vettingomobil/features/dashboard/presentation/pages/employer_dashboard_page.dart';

void main() {
  const dependencies = AppDependencies();

  test('dashboard use cases expose the local reference data', () {
    final candidate = dependencies.createCandidateDashboardController();
    final employer = dependencies.createEmployerDashboardController();

    expect(candidate.dashboard.userName, 'Alex');
    expect(candidate.dashboard.applications, hasLength(2));
    expect(candidate.dashboard.applicationHistory, hasLength(3));
    expect(candidate.dashboard.applicationHistory.last.status, 'Rejected');
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
    expect(
      find.text('You have 2 upcoming interviews and 3 new recommended roles.'),
      findsNothing,
    );
    final welcomeText = tester.widget<Text>(find.text('Welcome back, Alex.'));
    expect(welcomeText.style?.fontSize, 24);
    expect(find.text('Active Applications'), findsOneWidget);
    expect(find.text('Senior Frontend Engineer'), findsOneWidget);
    expect(find.text('Your Market Profile'), findsOneWidget);
    expect(find.byIcon(Icons.auto_awesome_rounded), findsNothing);
    expect(find.text('85'), findsOneWidget);
    expect(find.text('Vettingo'), findsOneWidget);
    expect(find.byIcon(Icons.notifications_outlined), findsNothing);
    final topBarRect = tester.getRect(find.byType(CandidateTopBar));
    final titleRect = tester.getRect(find.text('Vettingo'));
    expect(titleRect.center.dx, closeTo(topBarRect.center.dx, .01));
    expect(find.text('TalentPulse'), findsNothing);
    expect(find.text('Ana Sayfa'), findsOneWidget);
    expect(find.text('Başvurularım'), findsOneWidget);
    expect(find.text('Arama'), findsOneWidget);
    expect(find.text('Profil'), findsOneWidget);
    expect(find.text('Apps'), findsNothing);
    expect(find.text('Home'), findsNothing);
    expect(find.text('Jobs'), findsNothing);
    expect(find.byIcon(Icons.home_rounded), findsOneWidget);
    expect(find.byIcon(Icons.account_circle_outlined), findsOneWidget);
    expect(find.byType(CandidateScaffold), findsOneWidget);
    expect(find.byType(CandidateTopBar), findsOneWidget);
    expect(find.byType(CandidateBottomBar), findsOneWidget);
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
    expect(find.text('Vettingo'), findsOneWidget);
    expect(find.text('TalentPulse'), findsNothing);
    expect(find.text('EM'), findsNothing);
    expect(find.byIcon(Icons.notifications_outlined), findsNothing);
    final employerTopBarRect = tester.getRect(find.byType(TalentPulseTopBar));
    final employerTitleRect = tester.getRect(find.text('Vettingo'));
    expect(
      employerTitleRect.center.dx,
      closeTo(employerTopBarRect.center.dx, .01),
    );
    expect(find.text('Ana Sayfa'), findsOneWidget);
    expect(find.text('Başvurular'), findsOneWidget);
    expect(find.text('Arama'), findsOneWidget);
    expect(find.text('İlanlar'), findsOneWidget);
    expect(find.text('Home'), findsNothing);
    expect(find.text('Apps'), findsNothing);
    expect(find.text('Search'), findsNothing);
    expect(find.text('Jobs'), findsNothing);
    expect(find.byIcon(Icons.home_rounded), findsOneWidget);
    expect(find.byIcon(Icons.dashboard_rounded), findsNothing);
  });
}
