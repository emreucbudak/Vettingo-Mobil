import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vettingomobil/core/di/app_dependencies.dart';
import 'package:vettingomobil/features/candidate/presentation/widgets/candidate_shell.dart';
import 'package:vettingomobil/features/candidate_assessment/presentation/pages/candidate_assessment_page.dart';
import 'package:vettingomobil/features/job_search/presentation/pages/job_search_page.dart';
import 'package:vettingomobil/features/new_requisition/domain/entities/requisition.dart';
import 'package:vettingomobil/features/new_requisition/presentation/pages/new_requisition_page.dart';

void main() {
  const dependencies = AppDependencies();

  test('new feature controllers expose and update reference state', () {
    final assessment = dependencies.createCandidateAssessmentController();
    final search = dependencies.createJobSearchController();
    final requisition = dependencies.createNewRequisitionController();
    addTearDown(assessment.dispose);
    addTearDown(search.dispose);
    addTearDown(requisition.dispose);

    expect(assessment.currentIndex, 3);
    expect(assessment.assessment.questions, hasLength(20));
    expect(assessment.currentAnswer, 'userdata-loop');
    assessment.selectAnswer('api-error');
    expect(assessment.currentAnswer, 'api-error');

    search.clearFilters();
    search.updateQuery('Globex');
    expect(search.visibleMatches.single.company, 'Globex');

    expect(requisition.continueToNextStep(), isFalse);
    requisition.updateJobTitle('Senior Backend Engineer');
    requisition.selectDepartment('Engineering');
    requisition.selectLocationType(WorkLocationType.hybrid);
    expect(requisition.continueToNextStep(), isFalse);
    requisition.selectOffice('London, UK');
    expect(requisition.continueToNextStep(), isTrue);
  });

  testWidgets('candidate assessment renders and accepts an answer', (
    tester,
  ) async {
    await _setPhoneSize(tester);
    final controller = dependencies.createCandidateAssessmentController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      MaterialApp(home: CandidateAssessmentPage(controller: controller)),
    );

    expect(find.text('Question 4 of 20'), findsOneWidget);
    expect(find.text('UserProfile.jsx'), findsOneWidget);
    expect(find.text('42:15'), findsOneWidget);
    _expectCandidateShell();
    expect(find.byKey(const ValueKey('assessmentNextButton')), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('assessmentOption0')));
    await tester.pump();
    expect(controller.currentAnswer, 'api-error');
  });

  testWidgets('job search filters its recommendations', (tester) async {
    await _setPhoneSize(tester);
    final controller = dependencies.createJobSearchController();
    addTearDown(controller.dispose);
    controller.clearFilters();

    await tester.pumpWidget(
      MaterialApp(home: JobSearchPage(controller: controller)),
    );

    expect(find.text('Market Intelligence'), findsNothing);
    expect(find.text('Avg. Time to Fill'), findsNothing);
    expect(find.text('Comp Range'), findsNothing);
    expect(find.text('Önerilen Eşleşmeler'), findsOneWidget);
    expect(find.text('3 sonuç'), findsOneWidget);
    expect(find.text('VP of Engineering'), findsOneWidget);
    expect(find.text('Director of Engineering'), findsOneWidget);
    expect(find.byKey(const ValueKey('quickFilter0')), findsNothing);
    expect(find.byKey(const ValueKey('jobFilterButton')), findsOneWidget);
    _expectCandidateShell();

    await tester.enterText(
      find.byKey(const ValueKey('jobSearchField')),
      'Globex',
    );
    await tester.pump();

    expect(find.text('VP of Engineering'), findsNothing);
    expect(find.text('Director of Engineering'), findsOneWidget);
  });

  testWidgets('new requisition reveals conditional office validation', (
    tester,
  ) async {
    await _setPhoneSize(tester);
    final controller = dependencies.createNewRequisitionController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      MaterialApp(home: NewRequisitionPage(controller: controller)),
    );

    expect(find.text('New Requisition'), findsOneWidget);
    expect(find.text('Role Definition'), findsOneWidget);
    expect(find.byKey(const ValueKey('requisitionOfficeField')), findsNothing);

    await tester.tap(find.byKey(const ValueKey('locationType-hybrid')));
    await tester.pumpAndSettle();
    expect(
      find.byKey(const ValueKey('requisitionOfficeField')),
      findsOneWidget,
    );

    await tester.tap(find.byKey(const ValueKey('requisitionContinueButton')));
    await tester.pump();
    expect(find.text('Enter a job title to continue.'), findsOneWidget);
  });
}

void _expectCandidateShell() {
  expect(find.byType(CandidateScaffold), findsOneWidget);
  expect(find.byType(CandidateTopBar), findsOneWidget);
  expect(find.byType(CandidateBottomBar), findsOneWidget);
  expect(find.text('Vettingo'), findsOneWidget);
  expect(find.text('Ana Sayfa'), findsOneWidget);
  expect(find.text('Başvurularım'), findsOneWidget);
  expect(find.text('Arama'), findsOneWidget);
  expect(find.text('Profil'), findsOneWidget);
}

Future<void> _setPhoneSize(WidgetTester tester) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(430, 900);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);
}
