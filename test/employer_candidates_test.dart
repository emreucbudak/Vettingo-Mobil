import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vettingomobil/core/di/app_dependencies.dart';
import 'package:vettingomobil/core/theme/app_colors.dart';
import 'package:vettingomobil/features/candidate_detail/presentation/pages/candidate_detail_page.dart';
import 'package:vettingomobil/features/employer/presentation/pages/employer_candidates_page.dart';

void main() {
  const dependencies = AppDependencies();

  testWidgets('employer candidates page searches and filters boxed cards', (
    tester,
  ) async {
    await _setPhoneSize(tester);
    await tester.pumpWidget(
      MaterialApp(
        home: EmployerCandidatesPage(
          controller: dependencies.createEmployerDashboardController(),
        ),
        routes: {
          CandidateDetailPage.routeName: (context) => CandidateDetailPage(
            controller: dependencies.createCandidateDetailController(),
          ),
        },
      ),
    );

    expect(
      find.byKey(const ValueKey('employerCandidatesPage')),
      findsOneWidget,
    );
    expect(
      find.byKey(const ValueKey('employerCandidateSearchField')),
      findsOneWidget,
    );
    expect(find.text('Aday ara'), findsOneWidget);
    expect(find.text('4 aday'), findsOneWidget);
    expect(
      find.byKey(const ValueKey('employerCandidateCard0')),
      findsOneWidget,
    );
    expect(find.text('Sarah Jenkins'), findsOneWidget);
    expect(find.text('98%'), findsOneWidget);
    expect(find.text('Senior Product Designer'), findsOneWidget);
    expect(find.text('Adaylar'), findsOneWidget);
    expect(find.text('Başvurular'), findsNothing);
    expect(find.byIcon(Icons.groups_rounded), findsOneWidget);

    final selectedIndicator = find.byKey(const ValueKey('bottomNavIndicator2'));
    final selectedDecoration =
        tester.widget<AnimatedContainer>(selectedIndicator).decoration!
            as BoxDecoration;
    expect(selectedDecoration.color, AppColors.surfaceHighest);

    final candidateCardMaterial = tester.widget<Material>(
      find
          .descendant(
            of: find.byKey(const ValueKey('employerCandidateCard0')),
            matching: find.byType(Material),
          )
          .first,
    );
    final cardShape = candidateCardMaterial.shape! as RoundedRectangleBorder;
    expect(cardShape.borderRadius, BorderRadius.circular(12));
    expect(cardShape.side.color, AppColors.outlineVariant);

    await tester.enterText(
      find.byKey(const ValueKey('employerCandidateSearchField')),
      'Zeynep',
    );
    await tester.pump();
    expect(find.text('1 aday'), findsOneWidget);
    expect(find.text('Zeynep Kaya'), findsOneWidget);
    expect(find.text('Sarah Jenkins'), findsNothing);

    await tester.enterText(
      find.byKey(const ValueKey('employerCandidateSearchField')),
      '',
    );
    await tester.tap(
      find.byKey(const ValueKey('employerCandidateFilterButton')),
    );
    await tester.pumpAndSettle();
    expect(
      find.byKey(const ValueKey('employerCandidateFilterSheet')),
      findsOneWidget,
    );

    await tester.tap(
      find.byKey(const ValueKey('employerCandidateFilter-offer')),
    );
    await tester.tap(find.text('Sonuçları Göster'));
    await tester.pumpAndSettle();
    expect(find.text('1 aday'), findsOneWidget);
    expect(find.text('Zeynep Kaya'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('employerCandidateCard0')));
    await tester.pumpAndSettle();
    expect(find.byType(CandidateDetailPage), findsOneWidget);
  });
}

Future<void> _setPhoneSize(WidgetTester tester) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(430, 900);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);
}
