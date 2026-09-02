import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

class VettingoBottomNavigationBar extends StatelessWidget {
  const VettingoBottomNavigationBar({
    super.key,
    required this.items,
    required this.selectedIndex,
    required this.onSelected,
    this.indicatorKeyPrefix = 'bottomNavIndicator',
    this.itemKeyPrefix = 'bottomNav',
  });

  final String indicatorKeyPrefix;
  final String itemKeyPrefix;
  final List<(IconData, IconData, String)> items;
  final ValueChanged<int> onSelected;
  final int selectedIndex;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.outlineVariant)),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 72,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(items.length, (index) {
              final selected = index == selectedIndex;
              final item = items[index];
              return Semantics(
                selected: selected,
                button: true,
                label: item.$3,
                child: InkWell(
                  key: ValueKey('$itemKeyPrefix$index'),
                  borderRadius: BorderRadius.circular(18),
                  onTap: () => onSelected(index),
                  child: AnimatedContainer(
                    key: ValueKey('$indicatorKeyPrefix$index'),
                    duration: const Duration(milliseconds: 180),
                    width: 76,
                    height: 56,
                    decoration: BoxDecoration(
                      color: selected
                          ? AppColors.surfaceHighest
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          selected ? item.$2 : item.$1,
                          size: 22,
                          color: selected
                              ? AppColors.primary
                              : AppColors.onSurfaceVariant,
                        ),
                        const SizedBox(height: 3),
                        Text(
                          item.$3,
                          maxLines: 1,
                          style: TextStyle(
                            color: selected
                                ? AppColors.primary
                                : AppColors.onSurfaceVariant,
                            fontSize: 10,
                            height: 1,
                            fontWeight: selected
                                ? FontWeight.w700
                                : FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}
