import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

class VettingoTopBar extends StatelessWidget implements PreferredSizeWidget {
  const VettingoTopBar({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      automaticallyImplyLeading: false,
      toolbarHeight: 64,
      shape: const Border(bottom: BorderSide(color: AppColors.outlineVariant)),
      titleSpacing: 16,
      centerTitle: true,
      title: const Text(
        'Vettingo',
        style: TextStyle(
          color: AppColors.primary,
          fontSize: 20,
          height: 1.4,
          fontWeight: FontWeight.w600,
          letterSpacing: -.2,
        ),
      ),
    );
  }
}
