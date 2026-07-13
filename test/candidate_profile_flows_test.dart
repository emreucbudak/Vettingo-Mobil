import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vettingomobil/core/di/app_dependencies.dart';
import 'package:vettingomobil/features/candidate_detail/domain/entities/candidate_detail.dart';
import 'package:vettingomobil/features/candidate_detail/presentation/pages/candidate_detail_page.dart';
import 'package:vettingomobil/features/cv_review/presentation/pages/cv_review_page.dart';

void main() {
  const dependencies = AppDependencies();

  test('CV review controller edits and saves parsed candidate data', () {
    final controller = dependencies.createCvReviewController();
    addTearDown(controller.dispose);

    expect(controller.review.coreSkills, hasLength(6));
    controller.addSkill('Flutter');
    controller.updateSummary('Updated candidate summary');
    controller.completeReview();

    expect(controller.review.coreSkills, contains('Flutter'));
    expect(controller.review.summary, 'Updated candidate summary');
    expect(controller.completed, isTrue);
  });

  test(
    'candidate detail controller tracks accordions and pipeline actions',
    () {
      final controller = dependencies.createCandidateDetailController();
      addTearDown(controller.dispose);

      expect(controller.candidate.name, 'Sarah Jenkins');
      expect(controller.educationExpanded, isFalse);
      expect(controller.pipelineAction, CandidatePipelineAction.none);

      controller.toggleEducation();
      controller.scheduleInterview(DateTime(2026, 8, 1));
      expect(controller.educationExpanded, isTrue);
      expect(
        controller.pipelineAction,
        CandidatePipelineAction.interviewScheduled,
      );
      expect(controller.scheduledDate, DateTime(2026, 8, 1));

      controller.advanceCandidate();
      expect(controller.pipelineAction, CandidatePipelineAction.advanced);
    },
  );

  testWidgets('CV review page renders parsed data and adds a skill', (
    tester,
  ) async {
    await _setPhoneSize(tester);
    final controller = dependencies.createCvReviewController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      MaterialApp(home: CvReviewPage(controller: controller)),
    );

    expect(find.text('Review Parsed Data'), findsOneWidget);
    expect(find.text('Verify Candidate Info'), findsOneWidget);
    expect(find.text('React.js'), findsOneWidget);
    expect(find.text('Lead Developer'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('addCvSkillButton')));
    await tester.pumpAndSettle();
    await tester.enterText(
      find.byKey(const ValueKey('cvTextEditor')),
      'Flutter',
    );
    await tester.tap(find.text('Save'));
    await tester.pumpAndSettle();

    expect(controller.review.coreSkills, contains('Flutter'));
    expect(find.text('Flutter'), findsOneWidget);
  });

  testWidgets('candidate detail renders analysis and advances candidate', (
    tester,
  ) async {
    await _setPhoneSize(tester);
    final controller = dependencies.createCandidateDetailController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      MaterialApp(home: CandidateDetailPage(controller: controller)),
    );

    expect(find.text('Sarah Jenkins'), findsOneWidget);
    expect(find.text('AI Executive Summary'), findsOneWidget);
    expect(find.text('Strong Match (92%)'), findsOneWidget);
    expect(find.text('VP of Engineering'), findsOneWidget);
    expect(controller.educationExpanded, isFalse);

    await tester.ensureVisible(
      find.byKey(const ValueKey('candidateEducationSection')),
    );
    await tester.tap(find.byKey(const ValueKey('candidateEducationSection')));
    await tester.pumpAndSettle();
    expect(find.text('M.S. Computer Science'), findsOneWidget);
    expect(controller.educationExpanded, isTrue);

    await tester.tap(
      find.byKey(const ValueKey('advanceCandidateDetailButton')),
    );
    await tester.pump();
    expect(controller.pipelineAction, CandidatePipelineAction.advanced);
    expect(find.text('ADVANCED'), findsOneWidget);
  });
}

Future<void> _setPhoneSize(WidgetTester tester) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(430, 1000);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);
}
