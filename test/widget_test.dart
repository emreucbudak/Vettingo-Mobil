import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vettingomobil/app.dart';
import 'package:vettingomobil/core/di/app_dependencies.dart';
import 'package:vettingomobil/features/auth/domain/entities/login_credentials.dart';
import 'package:vettingomobil/features/auth/presentation/pages/login_page.dart';

void main() {
  testWidgets('app opens the redesigned dashboard login', (tester) async {
    await tester.pumpWidget(const VettingoApp());

    expect(find.text('TalentPulse'), findsNothing);
    expect(find.text('Access your dashboard'), findsNothing);
    expect(find.text('Vettingo'), findsOneWidget);
    expect(find.text('İş Arayan'), findsOneWidget);
    expect(find.text('İşveren'), findsOneWidget);
    expect(find.text('Email'), findsOneWidget);
    expect(find.text('Şifre'), findsOneWidget);
    expect(find.text('Şifrenizi mi unuttunuz?'), findsOneWidget);
    expect(find.text('Giriş Yap'), findsOneWidget);
    expect(find.text('LinkedIn ile Giriş Yap'), findsOneWidget);
    expect(find.text('Google ile Giriş Yap'), findsOneWidget);
    expect(find.text('Henüz kayıtlı değil misiniz?'), findsOneWidget);
    expect(find.text('Kayıt Olun.'), findsOneWidget);
    expect(find.byKey(const ValueKey('dashboardEmailField')), findsOneWidget);
    expect(
      find.byKey(const ValueKey('dashboardPasswordField')),
      findsOneWidget,
    );
    expect(find.byKey(const ValueKey('dashboardSignInButton')), findsOneWidget);
    expect(
      find.byKey(const ValueKey('dashboardLinkedInButton')),
      findsOneWidget,
    );
    expect(find.byKey(const ValueKey('dashboardGoogleButton')), findsOneWidget);
  });
  testWidgets('account type and remember me are managed by controller', (
    tester,
  ) async {
    final controller = const AppDependencies().createLoginController();

    await tester.pumpWidget(
      MaterialApp(home: LoginPage(controller: controller)),
    );

    await tester.tap(find.text('Employer'));
    await tester.pump();
    expect(controller.credentials.accountType, AccountType.employer);

    await tester.tap(find.byKey(const ValueKey('rememberMeCheckbox')));
    await tester.pump();
    expect(controller.credentials.rememberMe, isTrue);
  });
}
