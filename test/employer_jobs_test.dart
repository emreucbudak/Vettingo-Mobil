import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vettingomobil/core/di/app_dependencies.dart';
import 'package:vettingomobil/core/theme/app_colors.dart';
import 'package:vettingomobil/features/employer/presentation/pages/employer_jobs_page.dart';
import 'package:vettingomobil/features/new_requisition/presentation/pages/new_requisition_page.dart';

void main() {
  const dependencies = AppDependencies();

  testWidgets('employer jobs page searches boxed jobs and opens new job form', (
    tester,
  ) async {
    await _setPhoneSize(tester);
    await tester.pumpWidget(
      MaterialApp(
        home: EmployerJobsPage(
          controller: dependencies.createEmployerDashboardController(),
        ),
        routes: {
          NewRequisitionPage.routeName: (context) => NewRequisitionPage(
            controller: dependencies.createNewRequisitionController(),
          ),
        },
      ),
    );

    expect(find.byKey(const ValueKey('employerJobsPage')), findsOneWidget);
    expect(
      find.byKey(const ValueKey('employerJobSearchField')),
      findsOneWidget,
    );
    expect(find.text('Pozisyon veya konum ara'), findsOneWidget);
    expect(find.byKey(const ValueKey('employerJobCard0')), findsOneWidget);
    expect(find.byKey(const ValueKey('employerJobCard1')), findsOneWidget);
    expect(find.byKey(const ValueKey('employerJobCard2')), findsOneWidget);
    expect(find.text('Lead Data Scientist'), findsOneWidget);
    expect(find.text('VP of Engineering'), findsOneWidget);
    expect(find.text('Senior Marketing Manager'), findsOneWidget);
    expect(find.byKey(const ValueKey('employerNewJobButton')), findsOneWidget);
    expect(find.text('Yeni İlan'), findsOneWidget);

    final selectedIndicator = find.byKey(const ValueKey('bottomNavIndicator1'));
    final selectedDecoration =
        tester.widget<AnimatedContainer>(selectedIndicator).decoration!
            as BoxDecoration;
    expect(selectedDecoration.color, AppColors.surfaceHighest);
    expect(find.byIcon(Icons.work_rounded), findsOneWidget);

    final jobCardMaterial = tester.widget<Material>(
      find.descendant(
        of: find.byKey(const ValueKey('employerJobCard0')),
        matching: find.byType(Material),
      ),
    );
    final cardShape = jobCardMaterial.shape! as RoundedRectangleBorder;
    expect(cardShape.borderRadius, BorderRadius.circular(12));
    expect(cardShape.side.color, AppColors.outlineVariant);

    await tester.enterText(
      find.byKey(const ValueKey('employerJobSearchField')),
      'VP',
    );
    await tester.pump();
    expect(find.text('VP of Engineering'), findsOneWidget);
    expect(find.text('Lead Data Scientist'), findsNothing);
    expect(find.text('Senior Marketing Manager'), findsNothing);

    await tester.tap(find.byKey(const ValueKey('employerJobSearchClear')));
    await tester.pump();
    expect(find.text('Lead Data Scientist'), findsOneWidget);
    expect(find.text('Senior Marketing Manager'), findsOneWidget);

    final newJobButton = tester.widget<FloatingActionButton>(
      find.byKey(const ValueKey('employerNewJobButton')),
    );
    final buttonShape = newJobButton.shape! as RoundedRectangleBorder;
    expect(buttonShape.borderRadius, BorderRadius.circular(12));

    await tester.tap(find.byKey(const ValueKey('employerNewJobButton')));
    await tester.pumpAndSettle();
    expect(find.byType(NewRequisitionPage), findsOneWidget);
  });
}

Future<void> _setPhoneSize(WidgetTester tester) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(430, 900);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);
}
