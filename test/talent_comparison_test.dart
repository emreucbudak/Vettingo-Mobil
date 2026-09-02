import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vettingomobil/core/di/app_dependencies.dart';
import 'package:vettingomobil/features/talent_comparison/domain/entities/talent_comparison.dart';
import 'package:vettingomobil/features/talent_comparison/presentation/pages/talent_comparison_page.dart';

void main() {
  test('controller tracks the selected candidate and decisions', () {
    final controller = const AppDependencies()
        .createTalentComparisonController();
    addTearDown(controller.dispose);

    expect(controller.currentIndex, 0);
    expect(controller.currentCandidate.name, 'Sarah Jenkins');
    expect(controller.currentDecision, CandidateDecision.pending);

    controller.advanceCurrent();
    expect(controller.currentDecision, CandidateDecision.advanced);

    controller.selectCandidate(1);
    expect(controller.currentCandidate.name, 'Marcus Chen');
    expect(controller.currentDecision, CandidateDecision.pending);

    controller.rejectCurrent();
    expect(controller.currentDecision, CandidateDecision.rejected);
    expect(
      controller.decisionFor(controller.comparison.candidates.first),
      CandidateDecision.advanced,
    );
  });

  testWidgets('comparison page renders reference content and actions', (
    tester,
  ) async {
    final controller = const AppDependencies()
        .createTalentComparisonController();

    await tester.pumpWidget(
      MaterialApp(home: TalentComparisonPage(controller: controller)),
    );

    expect(find.text('Compare Talent'), findsOneWidget);
    expect(find.text('Ana Sayfa'), findsOneWidget);
    expect(find.text('Başvurular'), findsOneWidget);
    expect(find.text('Arama'), findsOneWidget);
    expect(find.text('Profil'), findsOneWidget);
    expect(find.text('İlanlar'), findsNothing);
    expect(find.text('Home'), findsNothing);
    expect(find.text('Apps'), findsNothing);
    expect(find.text('Search'), findsNothing);
    expect(find.text('Jobs'), findsNothing);
    expect(find.byIcon(Icons.home_outlined), findsOneWidget);
    expect(find.byIcon(Icons.dashboard_outlined), findsNothing);
    expect(find.byIcon(Icons.person_outline_rounded), findsOneWidget);
    expect(find.text('Senior Frontend Engineer'), findsOneWidget);
    expect(find.text('Sarah Jenkins'), findsOneWidget);
    expect(find.text('94% Match'), findsOneWidget);
    expect(find.byKey(const ValueKey('candidateCarousel')), findsOneWidget);

    await tester.ensureVisible(
      find.byKey(const ValueKey('advanceCandidateButton')),
    );
    await tester.tap(find.byKey(const ValueKey('advanceCandidateButton')));
    await tester.pump();

    expect(
      controller.decisionFor(controller.comparison.candidates.first),
      CandidateDecision.advanced,
    );
  });
}
