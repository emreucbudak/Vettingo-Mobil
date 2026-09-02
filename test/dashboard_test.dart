import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vettingomobil/core/di/app_dependencies.dart';
import 'package:vettingomobil/core/theme/app_colors.dart';
import 'package:vettingomobil/features/candidate/presentation/widgets/candidate_shell.dart';
import 'package:vettingomobil/features/dashboard/presentation/pages/candidate_dashboard_page.dart';
import 'package:vettingomobil/features/dashboard/presentation/pages/employer_dashboard_page.dart';
import 'package:vettingomobil/features/employer/presentation/widgets/employer_shell.dart';

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
    _expectHrStyleSelectedIndicator(tester);
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

    expect(find.text('TOPLAM BAŞVURU'), findsOneWidget);
    expect(find.text('AÇIK POZİSYONLAR'), findsOneWidget);
    expect(find.text('YZ İLE İNCELENEN'), findsOneWidget);
    expect(find.text('1,248'), findsOneWidget);
    expect(find.text('En İyi Eşleşmeler'), findsOneWidget);
    expect(find.text('Sarah Jenkins'), findsOneWidget);
    expect(find.text('Aktif İlanlar'), findsOneWidget);
    expect(find.text('TÜMÜNÜ GÖR'), findsOneWidget);
    expect(find.text('FİLTRELE'), findsNothing);
    expect(find.byIcon(Icons.filter_list_rounded), findsNothing);
    expect(find.text('TÜM İLANLARI GÖR'), findsOneWidget);
    expect(find.text('98% Eşleşme'), findsOneWidget);
    expect(find.text('TOTAL APPLICATIONS'), findsNothing);
    expect(find.text('Top AI Matches'), findsNothing);
    expect(find.text('Active Requisitions'), findsNothing);
    expect(find.text('Lead Data Scientist'), findsOneWidget);
    expect(find.text('Vettingo'), findsOneWidget);
    expect(find.text('EM'), findsNothing);
    expect(find.byIcon(Icons.notifications_outlined), findsNothing);
    final employerTopBarRect = tester.getRect(find.byType(EmployerTopBar));
    final employerTitleRect = tester.getRect(find.text('Vettingo'));
    expect(
      employerTitleRect.center.dx,
      closeTo(employerTopBarRect.center.dx, .01),
    );
    expect(find.text('Ana Sayfa'), findsOneWidget);
    expect(find.text('İlanlar'), findsOneWidget);
    expect(find.text('Adaylar'), findsOneWidget);
    expect(find.text('Başvurular'), findsNothing);
    expect(find.text('Arama'), findsNothing);
    expect(find.text('Profil'), findsOneWidget);
    expect(
      tester.getCenter(find.text('İlanlar')).dx,
      lessThan(tester.getCenter(find.text('Adaylar')).dx),
    );
    expect(find.text('Home'), findsNothing);
    expect(find.text('Apps'), findsNothing);
    expect(find.text('Search'), findsNothing);
    expect(find.text('Jobs'), findsNothing);
    expect(find.byIcon(Icons.home_rounded), findsOneWidget);
    expect(find.byIcon(Icons.dashboard_rounded), findsNothing);
    expect(find.byIcon(Icons.search_rounded), findsNothing);
    expect(find.byIcon(Icons.work_outline_rounded), findsOneWidget);
    expect(find.byIcon(Icons.groups_outlined), findsOneWidget);
    expect(find.byIcon(Icons.description_outlined), findsNothing);
    expect(find.byIcon(Icons.person_outline_rounded), findsOneWidget);
    _expectHrStyleSelectedIndicator(tester);
  });
}

void _expectHrStyleSelectedIndicator(WidgetTester tester) {
  final indicatorFinder = find.byKey(const ValueKey('bottomNavIndicator0'));
  final indicator = tester.widget<AnimatedContainer>(indicatorFinder);
  final decoration = indicator.decoration! as BoxDecoration;

  expect(tester.getSize(indicatorFinder), const Size(76, 56));
  expect(decoration.color, AppColors.surfaceHighest);
  expect(decoration.borderRadius, BorderRadius.circular(18));
}
