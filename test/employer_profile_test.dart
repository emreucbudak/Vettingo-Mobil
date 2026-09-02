import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vettingomobil/core/di/app_dependencies.dart';
import 'package:vettingomobil/core/theme/app_colors.dart';
import 'package:vettingomobil/core/widgets/talent_pulse_shell.dart';
import 'package:vettingomobil/features/dashboard/presentation/pages/employer_dashboard_page.dart';
import 'package:vettingomobil/features/employer/presentation/pages/employer_candidates_page.dart';
import 'package:vettingomobil/features/employer/presentation/pages/employer_jobs_page.dart';
import 'package:vettingomobil/features/employer/presentation/pages/employer_profile_page.dart';

void main() {
  const dependencies = AppDependencies();

  testWidgets('employer profile tab opens the shared profile design', (
    tester,
  ) async {
    await _setPhoneSize(tester);
    await tester.pumpWidget(
      MaterialApp(
        home: EmployerDashboardPage(
          controller: dependencies.createEmployerDashboardController(),
        ),
        routes: {
          EmployerDashboardPage.routeName: (context) => EmployerDashboardPage(
            controller: dependencies.createEmployerDashboardController(),
          ),
          EmployerProfilePage.routeName: (context) =>
              const EmployerProfilePage(),
          EmployerJobsPage.routeName: (context) => EmployerJobsPage(
            controller: dependencies.createEmployerDashboardController(),
          ),
          EmployerCandidatesPage.routeName: (context) => EmployerCandidatesPage(
            controller: dependencies.createEmployerDashboardController(),
          ),
        },
      ),
    );

    expect(find.text('Profil'), findsOneWidget);
    expect(find.text('İlanlar'), findsOneWidget);
    expect(find.text('Adaylar'), findsOneWidget);
    expect(find.text('Başvurular'), findsNothing);
    expect(find.text('Arama'), findsNothing);
    expect(
      tester.getCenter(find.text('İlanlar')).dx,
      lessThan(tester.getCenter(find.text('Adaylar')).dx),
    );
    expect(find.byIcon(Icons.search_rounded), findsNothing);
    expect(find.byIcon(Icons.person_outline_rounded), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('bottomNav3')));
    await tester.pumpAndSettle();

    expect(find.byType(EmployerProfilePage), findsOneWidget);
    expect(find.byKey(const ValueKey('employerProfilePage')), findsOneWidget);
    expect(find.byKey(const ValueKey('employerProfileHeader')), findsOneWidget);
    expect(
      find.byKey(const ValueKey('employerWorkplaceSettingsGroup')),
      findsOneWidget,
    );
    expect(
      find.byKey(const ValueKey('employerAccountSettingsGroup')),
      findsOneWidget,
    );
    expect(find.text('Acme Teknoloji'), findsOneWidget);
    expect(find.text('İşveren Hesabı'), findsOneWidget);
    expect(find.text('Şirket Profili'), findsOneWidget);
    expect(find.text('Ekip ve Yetkiler'), findsOneWidget);
    expect(find.text('İşe Alım Tercihleri'), findsOneWidget);
    expect(find.text('Bildirimler'), findsOneWidget);
    expect(find.text('Güvenlik'), findsOneWidget);
    expect(find.text('Yardım Merkezi'), findsOneWidget);
    expect(find.text('Çıkış Yap'), findsOneWidget);
    expect(find.byIcon(Icons.person_rounded), findsOneWidget);

    final indicatorFinder = find.byKey(const ValueKey('bottomNavIndicator3'));
    final indicator = tester.widget<AnimatedContainer>(indicatorFinder);
    final decoration = indicator.decoration! as BoxDecoration;
    expect(tester.getSize(indicatorFinder), const Size(76, 56));
    expect(decoration.color, AppColors.surfaceHighest);
    expect(decoration.borderRadius, BorderRadius.circular(18));

    final topBar = find.byType(TalentPulseTopBar);
    expect(
      find.descendant(
        of: topBar,
        matching: find.byIcon(Icons.notifications_outlined),
      ),
      findsNothing,
    );

    await tester.tap(find.byKey(const ValueKey('bottomNav0')));
    await tester.pumpAndSettle();
    expect(find.text('TOTAL APPLICATIONS'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('bottomNav1')));
    await tester.pumpAndSettle();
    expect(find.byType(EmployerJobsPage), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('bottomNav2')));
    await tester.pumpAndSettle();
    expect(find.byType(EmployerCandidatesPage), findsOneWidget);
  });
}

Future<void> _setPhoneSize(WidgetTester tester) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(430, 900);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);
}
