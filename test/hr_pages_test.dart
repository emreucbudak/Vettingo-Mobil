import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vettingomobil/app.dart';
import 'package:vettingomobil/core/widgets/talent_pulse_shell.dart';
import 'package:vettingomobil/features/hr/presentation/widgets/hr_shell.dart';

void main() {
  testWidgets('HR has separate mobile pages and shared navigation', (
    tester,
  ) async {
    await _setPhoneSize(tester);
    await tester.pumpWidget(const VettingoApp());

    await tester.tap(find.text('İşveren'));
    await tester.pump();
    await tester.tap(find.byKey(const ValueKey('dashboardSignInButton')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('hrDashboardPage')), findsOneWidget);
    expect(find.byType(HrScaffold), findsOneWidget);
    expect(find.byType(CandidateScaffold), findsNothing);
    expect(find.text('Açık Pozisyon'), findsOneWidget);
    expect(find.text('Yaklaşan Mülakatlar'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('hrBottomNav1')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('hrJobsPage')), findsOneWidget);
    expect(find.text('İş İlanları'), findsOneWidget);
    expect(find.text('3 ilan'), findsOneWidget);
    expect(find.byKey(const ValueKey('hrNewJobButton')), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('hrBottomNav2')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('hrCandidatesPage')), findsOneWidget);
    expect(find.text('4 aday'), findsOneWidget);
    expect(
      find.byKey(const ValueKey('hrCandidateFilterButton')),
      findsOneWidget,
    );

    await tester.tap(find.byKey(const ValueKey('hrCandidateFilterButton')));
    await tester.pumpAndSettle();
    expect(
      find.byKey(const ValueKey('hrCandidateFilterSheet')),
      findsOneWidget,
    );
    expect(find.text('Adayları Filtrele'), findsOneWidget);
    await tester.tap(find.text('Sonuçları Göster'));
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(const ValueKey('hrBottomNav3')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('hrProfilePage')), findsOneWidget);
    expect(find.text('Profil ve Ayarlar'), findsOneWidget);
    expect(find.text('Acme Teknoloji'), findsOneWidget);
  });

  testWidgets('HR job and candidate lists can be searched', (tester) async {
    await _setPhoneSize(tester);
    await tester.pumpWidget(const VettingoApp());

    await tester.tap(find.text('İşveren'));
    await tester.pump();
    await tester.tap(find.byKey(const ValueKey('dashboardSignInButton')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('hrBottomNav1')));
    await tester.pumpAndSettle();

    await tester.enterText(
      find.byKey(const ValueKey('hrJobSearchField')),
      'VP',
    );
    await tester.pump();
    expect(find.text('VP of Engineering'), findsOneWidget);
    expect(find.text('Lead Data Scientist'), findsNothing);

    await tester.tap(find.byKey(const ValueKey('hrBottomNav2')));
    await tester.pumpAndSettle();
    await tester.enterText(
      find.byKey(const ValueKey('hrCandidateSearchField')),
      'Zeynep',
    );
    await tester.pump();
    expect(find.text('Zeynep Kaya'), findsOneWidget);
    expect(find.text('Sarah Jenkins'), findsNothing);
  });
}

Future<void> _setPhoneSize(WidgetTester tester) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(430, 900);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);
}
