import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';

enum HrNavigationItem { dashboard, jobs, candidates, profile }

class HrScaffold extends StatelessWidget {
  const HrScaffold({
    super.key,
    required this.body,
    required this.selectedItem,
    this.floatingActionButton,
  });

  final Widget body;
  final Widget? floatingActionButton;
  final HrNavigationItem selectedItem;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const HrTopBar(),
      body: body,
      floatingActionButton: floatingActionButton,
      bottomNavigationBar: HrBottomBar(
        selectedItem: selectedItem,
        onSelected: (item) => _openHrDestination(context, item, selectedItem),
      ),
    );
  }
}

class HrTopBar extends StatelessWidget implements PreferredSizeWidget {
  const HrTopBar({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      key: const ValueKey('hrTopBar'),
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

class HrBottomBar extends StatelessWidget {
  const HrBottomBar({
    super.key,
    required this.selectedItem,
    required this.onSelected,
  });

  final ValueChanged<HrNavigationItem> onSelected;
  final HrNavigationItem selectedItem;

  static const _items = <(IconData, IconData, String)>[
    (Icons.home_outlined, Icons.home_rounded, 'Ana Sayfa'),
    (Icons.work_outline_rounded, Icons.work_rounded, 'İlanlar'),
    (Icons.groups_outlined, Icons.groups_rounded, 'Adaylar'),
    (Icons.person_outline_rounded, Icons.person_rounded, 'Profil'),
  ];

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      key: const ValueKey('hrBottomBar'),
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
            children: List.generate(_items.length, (index) {
              final selected = selectedItem.index == index;
              final item = _items[index];
              return Semantics(
                selected: selected,
                button: true,
                label: item.$3,
                child: InkWell(
                  key: ValueKey('hrBottomNav$index'),
                  borderRadius: BorderRadius.circular(18),
                  onTap: () => onSelected(HrNavigationItem.values[index]),
                  child: AnimatedContainer(
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

void showHrMessage(BuildContext context, String message) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(content: Text(message)));
}

void _openHrDestination(
  BuildContext context,
  HrNavigationItem destination,
  HrNavigationItem current,
) {
  if (destination == current) return;

  final routeName = switch (destination) {
    HrNavigationItem.dashboard => '/hr-dashboard',
    HrNavigationItem.jobs => '/hr-jobs',
    HrNavigationItem.candidates => '/hr-candidates',
    HrNavigationItem.profile => '/hr-profile',
  };
  Navigator.of(context).pushReplacementNamed(routeName, arguments: destination);
}
