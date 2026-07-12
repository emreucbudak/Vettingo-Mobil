import 'package:flutter/material.dart';

import 'core/di/app_dependencies.dart';
import 'features/auth/presentation/pages/login_page.dart';
import 'features/talent_comparison/presentation/pages/talent_comparison_page.dart';

class VettingoApp extends StatelessWidget {
  const VettingoApp({super.key, this.dependencies = const AppDependencies()});

  final AppDependencies dependencies;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TalentPulse',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Inter',
        scaffoldBackgroundColor: const Color(0xFFF8F9FF),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF091426),
          primary: const Color(0xFF091426),
          surface: const Color(0xFFF8F9FF),
        ),
      ),
      home: LoginPage(controller: dependencies.createLoginController()),
      routes: {
        TalentComparisonPage.routeName: (context) => TalentComparisonPage(
          controller: dependencies.createTalentComparisonController(),
        ),
      },
    );
  }
}
