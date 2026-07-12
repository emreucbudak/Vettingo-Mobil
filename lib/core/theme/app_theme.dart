import 'package:flutter/material.dart';

import 'app_colors.dart';

abstract final class AppTheme {
  static ThemeData get light {
    final scheme = ColorScheme.fromSeed(
      seedColor: AppColors.primary,
      primary: AppColors.primary,
      surface: AppColors.surface,
    );
    return ThemeData(
      useMaterial3: true,
      fontFamily: 'Inter',
      scaffoldBackgroundColor: AppColors.surface,
      colorScheme: scheme,
      dividerColor: AppColors.outlineVariant,
      appBarTheme: const AppBarTheme(
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.onSurfaceVariant,
      ),
      snackBarTheme: const SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
