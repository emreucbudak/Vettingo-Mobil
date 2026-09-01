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

  testWidgets('login opens candidate dashboard without validation', (
    tester,
  ) async {
    await tester.pumpWidget(const VettingoApp());

    await tester.tap(find.byKey(const ValueKey('dashboardSignInButton')));
    await tester.pumpAndSettle();

    expect(find.text('Welcome back, Alex.'), findsOneWidget);
  });

  testWidgets('employer login opens the separate HR dashboard', (tester) async {
    await tester.pumpWidget(const VettingoApp());

    await tester.tap(find.text('İşveren'));
    await tester.pump();
    await tester.tap(find.byKey(const ValueKey('dashboardSignInButton')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('hrDashboardPage')), findsOneWidget);
    expect(find.text('Merhaba, Elif'), findsOneWidget);
    expect(find.text('Hızlı İşlemler'), findsOneWidget);
    expect(find.byKey(const ValueKey('hrBottomBar')), findsOneWidget);
  });

  testWidgets('candidate profile tab opens the account menu', (tester) async {
    await tester.pumpWidget(const VettingoApp());

    await tester.tap(find.byKey(const ValueKey('dashboardSignInButton')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('bottomNav3')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('candidateProfileMenu')), findsOneWidget);
    expect(find.text('Profilim'), findsOneWidget);
    expect(find.text('Başvurularım'), findsOneWidget);
    expect(find.text('Kaydedilen İlanlar'), findsOneWidget);
    expect(find.text('Ayarlar'), findsOneWidget);
    expect(find.text('Yardım Merkezi'), findsOneWidget);
    expect(find.text('Çıkış Yap'), findsOneWidget);
  });

  testWidgets('register link opens the mobile registration form', (
    tester,
  ) async {
    await tester.pumpWidget(const VettingoApp());

    final registerLink = find.byKey(const ValueKey('dashboardRegisterButton'));
    await tester.ensureVisible(registerLink);
    await tester.tap(registerLink);
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('dashboardRegisterPage')), findsOneWidget);
    expect(find.text('Vettingo'), findsOneWidget);
    expect(find.text('Ad'), findsOneWidget);
    expect(find.text('Soyad'), findsOneWidget);
    expect(find.text('E-posta Adresi'), findsOneWidget);
    expect(find.text('Şifre'), findsOneWidget);
    expect(find.byKey(const ValueKey('registerNameField')), findsOneWidget);
    expect(find.byKey(const ValueKey('registerSurnameField')), findsOneWidget);
    expect(find.byKey(const ValueKey('registerEmailField')), findsOneWidget);
    expect(find.byKey(const ValueKey('registerPasswordField')), findsOneWidget);
    expect(find.byKey(const ValueKey('registerCompanyField')), findsNothing);
    expect(
      find.descendant(
        of: find.byKey(const ValueKey('registerNameField')),
        matching: find.byIcon(Icons.person_outline_rounded),
      ),
      findsOneWidget,
    );
    expect(
      find.descendant(
        of: find.byKey(const ValueKey('registerSurnameField')),
        matching: find.byIcon(Icons.account_box_outlined),
      ),
      findsOneWidget,
    );
    expect(find.text('Kayıt Ol'), findsOneWidget);
    expect(find.text('veya'), findsOneWidget);
    expect(find.text('Zaten hesabınız var mı?'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('registerEmployerButton')));
    await tester.pumpAndSettle();
    expect(find.text('Şirket Adı'), findsOneWidget);
    expect(find.byKey(const ValueKey('registerCompanyField')), findsOneWidget);

    final loginLink = find.byKey(const ValueKey('registerLoginButton'));
    await tester.ensureVisible(loginLink);
    await tester.tap(loginLink);
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('dashboardSignInButton')), findsOneWidget);
  });

  testWidgets('register opens employer dashboard without validation', (
    tester,
  ) async {
    await tester.pumpWidget(const VettingoApp());

    final registerLink = find.byKey(const ValueKey('dashboardRegisterButton'));
    await tester.ensureVisible(registerLink);
    await tester.tap(registerLink);
    await tester.pumpAndSettle();

    final submitButton = find.byKey(const ValueKey('registerSubmitButton'));
    await tester.ensureVisible(submitButton);
    await tester.tap(submitButton);
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('hrDashboardPage')), findsOneWidget);
    expect(find.text('Merhaba, Elif'), findsOneWidget);
  });

  testWidgets('register legal links open scrollable documents', (tester) async {
    await tester.pumpWidget(const VettingoApp());

    final registerLink = find.byKey(const ValueKey('dashboardRegisterButton'));
    await tester.ensureVisible(registerLink);
    await tester.tap(registerLink);
    await tester.pumpAndSettle();

    final termsLink = find.byKey(const ValueKey('registerTermsLink'));
    await tester.ensureVisible(termsLink);
    await tester.tap(termsLink);
    await tester.pumpAndSettle();

    expect(find.text('Kullanım Koşulları'), findsOneWidget);
    expect(find.byKey(const ValueKey('registerLegalDialog')), findsOneWidget);
    expect(find.byKey(const ValueKey('registerLegalScroll')), findsOneWidget);
    await tester.drag(
      find.byKey(const ValueKey('registerLegalScroll')),
      const Offset(0, -250),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('registerLegalCloseButton')));
    await tester.pumpAndSettle();

    final privacyLink = find.byKey(const ValueKey('registerPrivacyLink'));
    await tester.ensureVisible(privacyLink);
    await tester.tap(privacyLink);
    await tester.pumpAndSettle();

    expect(find.text('Gizlilik Politikası'), findsOneWidget);
    expect(find.byKey(const ValueKey('registerLegalScroll')), findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('registerLegalCloseButton')));
    await tester.pumpAndSettle();
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
