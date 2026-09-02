import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vettingomobil/app.dart';
import 'package:vettingomobil/core/widgets/talent_pulse_shell.dart';
import 'package:vettingomobil/features/hr/presentation/pages/hr_dashboard_page.dart';
import 'package:vettingomobil/features/hr/presentation/widgets/hr_shell.dart';

void main() {
  testWidgets('HR has separate mobile pages and shared navigation', (
    tester,
  ) async {
    await _setPhoneSize(tester);
    await _openHrDashboard(tester);

    expect(find.byKey(const ValueKey('hrDashboardPage')), findsOneWidget);
    expect(find.byType(HrScaffold), findsOneWidget);
    expect(find.byType(CandidateScaffold), findsNothing);
    expect(find.text('Vettingo'), findsOneWidget);
    expect(find.text('V'), findsNothing);
    expect(find.text('EY'), findsNothing);
    expect(find.text('İK Çalışma Alanı'), findsNothing);
    expect(find.byKey(const ValueKey('hrNotificationsButton')), findsNothing);
    expect(find.byIcon(Icons.notifications_outlined), findsNothing);
    final topBarRect = tester.getRect(find.byType(HrTopBar));
    final titleRect = tester.getRect(find.text('Vettingo'));
    expect(titleRect.center.dx, closeTo(topBarRect.center.dx, .01));
    expect(find.byIcon(Icons.home_rounded), findsOneWidget);
    expect(find.byIcon(Icons.dashboard_rounded), findsNothing);
    expect(find.text('Açık Pozisyon'), findsOneWidget);
    expect(find.text('Yaklaşan Mülakatlar'), findsOneWidget);
    expect(
      find.text('İşe alım süreçlerinde bugün neler olduğuna göz at.'),
      findsNothing,
    );
    expect(find.text('Sık kullandığın işlemlere hızlıca ulaş.'), findsNothing);
    expect(find.text('Bugün planlanmış 2 görüşme var.'), findsNothing);
    expect(
      find.text('Yapay zekâ eşleşme puanı en yüksek adaylar.'),
      findsNothing,
    );

    await tester.tap(find.byKey(const ValueKey('hrBottomNav1')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('hrJobsPage')), findsOneWidget);
    expect(find.text('İş İlanları'), findsNothing);
    expect(find.text('Açık pozisyonları ve aday akışını yönet.'), findsNothing);
    expect(find.text('3 ilan'), findsNothing);
    expect(find.byKey(const ValueKey('hrNewJobButton')), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('hrBottomNav2')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('hrCandidatesPage')), findsOneWidget);
    expect(find.text('Adaylar'), findsOneWidget);
    expect(
      find.text('Başvuruları değerlendir ve süreci ilerlet.'),
      findsNothing,
    );
    expect(find.text('4 aday'), findsNothing);
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
    expect(find.text('Profil ve Ayarlar'), findsNothing);
    expect(find.text('Hesabını ve İK çalışma alanını yönet.'), findsNothing);
    expect(find.text('Acme Teknoloji'), findsNothing);
    expect(find.text('Kurumsal Çalışma Alanı'), findsNothing);
    expect(find.text('ekip üyesi'), findsNothing);
    expect(find.byKey(const ValueKey('hrProfileSettingsTile')), findsOneWidget);
    expect(find.byIcon(Icons.edit_outlined), findsNothing);
    for (final subtitle in [
      'Şirket bilgileri ve marka ayarları',
      'İK ekibini ve erişim rollerini yönet',
      'Aday akışı ve değerlendirme ayarları',
      'E-posta ve mobil bildirim tercihleri',
      'Şifre ve oturum güvenliği',
      'Destek ve sık sorulan sorular',
    ]) {
      expect(find.text(subtitle), findsNothing);
    }
  });

  testWidgets('HR job and candidate lists can be searched', (tester) async {
    await _setPhoneSize(tester);
    await _openHrDashboard(tester);
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

Future<void> _openHrDashboard(WidgetTester tester) async {
  await tester.pumpWidget(const VettingoApp());
  final navigator = tester.state<NavigatorState>(find.byType(Navigator));
  navigator.pushReplacementNamed<void, void>(HrDashboardPage.routeName);
  await tester.pumpAndSettle();
}

Future<void> _setPhoneSize(WidgetTester tester) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(430, 900);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);
}
