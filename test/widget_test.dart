import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vettingomobil/app.dart';
import 'package:vettingomobil/core/di/app_dependencies.dart';
import 'package:vettingomobil/core/widgets/talent_pulse_shell.dart';
import 'package:vettingomobil/features/auth/domain/entities/login_credentials.dart';
import 'package:vettingomobil/features/auth/presentation/pages/login_page.dart';
import 'package:vettingomobil/features/dashboard/presentation/pages/candidate_applications_page.dart';

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

  testWidgets('candidate login validates before opening the dashboard', (
    tester,
  ) async {
    await tester.pumpWidget(const VettingoApp());

    await tester.tap(find.byKey(const ValueKey('dashboardSignInButton')));
    await tester.pump();

    expect(find.text('Please enter your email address'), findsOneWidget);
    expect(find.text('Please enter your password'), findsOneWidget);
    expect(find.text('Welcome back, Alex.'), findsNothing);

    await tester.enterText(
      find.byKey(const ValueKey('dashboardEmailField')),
      'geçersiz-email',
    );
    await tester.enterText(
      find.byKey(const ValueKey('dashboardPasswordField')),
      '123',
    );
    await tester.tap(find.byKey(const ValueKey('dashboardSignInButton')));
    await tester.pump();

    expect(find.text('Please enter a valid email'), findsOneWidget);
    expect(find.text('Password must be at least 6 characters'), findsOneWidget);
    expect(find.text('Welcome back, Alex.'), findsNothing);

    await _enterValidDashboardCredentials(tester);
    await tester.tap(find.byKey(const ValueKey('dashboardSignInButton')));
    await tester.pumpAndSettle();

    expect(find.text('Welcome back, Alex.'), findsOneWidget);
  });

  testWidgets(
    'employer login bypasses validation and opens the employer dashboard',
    (tester) async {
      await tester.pumpWidget(const VettingoApp());

      await tester.tap(find.text('İşveren'));
      await tester.pump();
      await tester.tap(find.byKey(const ValueKey('dashboardSignInButton')));
      await tester.pumpAndSettle();

      expect(find.text('Please enter your email address'), findsNothing);
      expect(find.text('Please enter your password'), findsNothing);
      expect(find.text('TOPLAM BAŞVURU'), findsOneWidget);
      expect(find.text('En İyi Eşleşmeler'), findsOneWidget);
      expect(find.text('Aktif İlanlar'), findsOneWidget);
      expect(find.byKey(const ValueKey('hrDashboardPage')), findsNothing);
    },
  );

  testWidgets('candidate profile tab opens the account menu', (tester) async {
    await tester.pumpWidget(const VettingoApp());

    await _submitValidDashboardLogin(tester);
    await tester.tap(find.byKey(const ValueKey('bottomNav3')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('candidateProfileMenu')), findsOneWidget);
    expect(
      find.byKey(const ValueKey('candidateProfileHeader')),
      findsOneWidget,
    );
    expect(
      find.byKey(const ValueKey('candidateCareerSettingsGroup')),
      findsOneWidget,
    );
    expect(
      find.byKey(const ValueKey('candidateAccountSettingsGroup')),
      findsOneWidget,
    );
    expect(find.byType(CandidateTopBar), findsOneWidget);
    expect(find.byType(CandidateBottomBar), findsOneWidget);
    final menuRect = tester.getRect(
      find.byKey(const ValueKey('candidateProfileMenu')),
    );
    final topBarRect = tester.getRect(find.byType(CandidateTopBar));
    final bottomBarRect = tester.getRect(find.byType(CandidateBottomBar));
    expect(menuRect.top, greaterThanOrEqualTo(topBarRect.bottom));
    expect(menuRect.bottom, lessThanOrEqualTo(bottomBarRect.top));
    expect(find.text('Profilim'), findsOneWidget);
    expect(find.text('Başvurularım'), findsOneWidget);
    expect(find.text('Kaydedilen İlanlar'), findsOneWidget);
    expect(find.text('Mülakatlarım'), findsOneWidget);
    expect(find.text('Mesajlarım'), findsOneWidget);
    expect(find.text('Bildirimler'), findsOneWidget);
    expect(find.text('Yardım Merkezi'), findsOneWidget);
    expect(find.text('Ayarlar'), findsOneWidget);
    expect(find.text('Çıkış Yap'), findsOneWidget);
    expect(find.text('Profil ve CV bilgilerini görüntüle'), findsNothing);
    expect(find.text('İş başvurularını takip et'), findsNothing);
    expect(find.text('Daha sonra bakmak için kaydettiklerin'), findsNothing);
    expect(find.text('Hesap ve bildirim tercihleri'), findsNothing);
    expect(find.text('Destek ve sık sorulan sorular'), findsNothing);
    expect(find.text('Hesabından güvenli şekilde çık'), findsNothing);
  });

  testWidgets(
    'candidate applications tab lists applied jobs and filters by status',
    (tester) async {
      await tester.pumpWidget(const VettingoApp());

      await _submitValidDashboardLogin(tester);
      await tester.tap(find.byKey(const ValueKey('bottomNav1')));
      await tester.pumpAndSettle();

      expect(find.byType(CandidateApplicationsPage), findsOneWidget);
      expect(
        find.byKey(const ValueKey('candidateApplicationsPage')),
        findsOneWidget,
      );
      expect(find.byKey(const ValueKey('jobSearchField')), findsNothing);
      expect(
        find.byKey(const ValueKey('applicationFilterOngoing')),
        findsOneWidget,
      );
      expect(
        find.byKey(const ValueKey('applicationFilterRejected')),
        findsOneWidget,
      );
      expect(find.text('Senior Frontend Engineer'), findsOneWidget);
      expect(find.text('Staff UX Designer'), findsOneWidget);
      expect(find.text('Product Designer'), findsNothing);

      await tester.tap(find.byKey(const ValueKey('applicationFilterRejected')));
      await tester.pumpAndSettle();

      expect(find.text('Senior Frontend Engineer'), findsNothing);
      expect(find.text('Staff UX Designer'), findsNothing);
      expect(find.text('Product Designer'), findsOneWidget);
      expect(find.text('1 başvuru'), findsOneWidget);
    },
  );

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

  testWidgets('register validates before opening employer dashboard', (
    tester,
  ) async {
    await tester.pumpWidget(const VettingoApp());

    final registerLink = find.byKey(const ValueKey('dashboardRegisterButton'));
    await tester.ensureVisible(registerLink);
    await tester.tap(registerLink);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('registerEmployerButton')));
    await tester.pumpAndSettle();

    final submitButton = find.byKey(const ValueKey('registerSubmitButton'));
    await tester.ensureVisible(submitButton);
    await tester.tap(submitButton);
    await tester.pump();

    expect(find.byKey(const ValueKey('dashboardRegisterPage')), findsOneWidget);
    expect(find.byKey(const ValueKey('hrDashboardPage')), findsNothing);
    expect(find.text('Ad alanı zorunludur.'), findsOneWidget);
    expect(find.text('Soyad alanı zorunludur.'), findsOneWidget);
    expect(find.text('E-posta adresi zorunludur.'), findsOneWidget);
    expect(find.text('Şifre alanı zorunludur.'), findsOneWidget);
    expect(find.text('Şirket adı zorunludur.'), findsOneWidget);
    expect(find.text('Devam etmek için koşulları kabul edin.'), findsOneWidget);

    await tester.enterText(
      find.byKey(const ValueKey('registerNameField')),
      'Elif',
    );
    await tester.enterText(
      find.byKey(const ValueKey('registerSurnameField')),
      'Yılmaz',
    );
    await tester.enterText(
      find.byKey(const ValueKey('registerEmailField')),
      'elif@example.com',
    );
    await tester.enterText(
      find.byKey(const ValueKey('registerPasswordField')),
      'password123',
    );
    await tester.enterText(
      find.byKey(const ValueKey('registerCompanyField')),
      'Acme Teknoloji',
    );
    final termsCheckbox = find.byKey(const ValueKey('registerTermsCheckbox'));
    await tester.ensureVisible(termsCheckbox);
    await tester.tap(termsCheckbox);
    await tester.pump();

    await tester.ensureVisible(submitButton);
    await tester.tap(submitButton);
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('hrDashboardPage')), findsOneWidget);
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

Future<void> _enterValidDashboardCredentials(WidgetTester tester) async {
  await tester.enterText(
    find.byKey(const ValueKey('dashboardEmailField')),
    'alex@example.com',
  );
  await tester.enterText(
    find.byKey(const ValueKey('dashboardPasswordField')),
    'password123',
  );
}

Future<void> _submitValidDashboardLogin(WidgetTester tester) async {
  await _enterValidDashboardCredentials(tester);
  await tester.tap(find.byKey(const ValueKey('dashboardSignInButton')));
  await tester.pumpAndSettle();
}
