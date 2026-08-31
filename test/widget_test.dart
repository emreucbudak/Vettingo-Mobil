import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vettingomobil/app.dart';
import 'package:vettingomobil/core/di/app_dependencies.dart';
import 'package:vettingomobil/features/auth/domain/entities/login_credentials.dart';
import 'package:vettingomobil/features/auth/presentation/pages/login_page.dart';

void main() {
  testWidgets('app opens the dashboard login', (tester) async {
    await tester.pumpWidget(const VettingoApp());

    expect(find.text('TalentPulse'), findsOneWidget);
    expect(find.text('Access your dashboard'), findsOneWidget);
    expect(find.text('Job Seeker'), findsOneWidget);
    expect(find.text('Employer'), findsOneWidget);
    expect(find.byKey(const ValueKey('dashboardEmailField')), findsOneWidget);
    expect(
      find.byKey(const ValueKey('dashboardPasswordField')),
      findsOneWidget,
    );
    expect(find.byKey(const ValueKey('dashboardSignInButton')), findsOneWidget);
    expect(find.text('Hassas Yetenek\nAnalizi.'), findsNothing);
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
