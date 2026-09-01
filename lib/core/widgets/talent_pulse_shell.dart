import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

class TalentPulseTopBar extends StatelessWidget implements PreferredSizeWidget {
  const TalentPulseTopBar({
    super.key,
    this.avatarLabel = 'TP',
    this.centerTitle = true,
    this.onNotifications,
    this.showAvatar = true,
    this.showNotifications = true,
    this.showTitle = true,
  });

  final String avatarLabel;
  final bool centerTitle;
  final VoidCallback? onNotifications;
  final bool showAvatar;
  final bool showNotifications;
  final bool showTitle;

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      automaticallyImplyLeading: false,
      toolbarHeight: 64,
      shape: const Border(bottom: BorderSide(color: AppColors.outlineVariant)),
      leadingWidth: showAvatar ? 64 : 0,
      leading: showAvatar
          ? Padding(
              padding: const EdgeInsets.only(left: 16),
              child: Align(
                alignment: Alignment.centerLeft,
                child: CircleAvatar(
                  radius: 16,
                  backgroundColor: AppColors.surfaceHighest,
                  foregroundColor: AppColors.primary,
                  child: Text(
                    avatarLabel,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            )
          : null,
      titleSpacing: showAvatar ? NavigationToolbar.kMiddleSpacing : 16,
      centerTitle: centerTitle,
      title: showTitle
          ? const Text(
              'TalentPulse',
              style: TextStyle(
                color: AppColors.primary,
                fontSize: 20,
                height: 1.4,
                fontWeight: FontWeight.w600,
                letterSpacing: -.2,
              ),
            )
          : null,
      actions: showNotifications
          ? [
              IconButton(
                tooltip: 'Notifications',
                onPressed: onNotifications,
                icon: const Icon(Icons.notifications_outlined),
              ),
              const SizedBox(width: 8),
            ]
          : null,
    );
  }
}

class TalentPulseBottomBar extends StatelessWidget {
  const TalentPulseBottomBar({
    super.key,
    this.selectedIndex = 0,
    this.items = _defaultItems,
    required this.onSelected,
  });

  final int selectedIndex;
  final List<(IconData, IconData, String)> items;
  final ValueChanged<int> onSelected;

  static const _defaultItems = <(IconData, IconData, String)>[
    (Icons.dashboard_outlined, Icons.dashboard_rounded, 'Home'),
    (Icons.description_outlined, Icons.description_rounded, 'Apps'),
    (Icons.search_rounded, Icons.search_rounded, 'Search'),
    (Icons.work_outline_rounded, Icons.work_rounded, 'Jobs'),
  ];

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
                  key: ValueKey('bottomNav$index'),
                  borderRadius: BorderRadius.circular(999),
                  onTap: () => onSelected(index),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 180),
                    width: 64,
                    height: 56,
                    decoration: BoxDecoration(
                      color: selected
                          ? AppColors.surfaceHighest
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(999),
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
                        const SizedBox(height: 2),
                        Text(
                          item.$3,
                          style: TextStyle(
                            color: selected
                                ? AppColors.primary
                                : AppColors.onSurfaceVariant,
                            fontSize: 11,
                            height: 1,
                            fontWeight: selected
                                ? FontWeight.w600
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

enum CandidateNavigationItem { home, jobs, search, profile }

class CandidateTopBar extends StatelessWidget implements PreferredSizeWidget {
  const CandidateTopBar({
    super.key,
    this.avatarLabel = 'A',
    this.onNotifications,
  });

  final String avatarLabel;
  final VoidCallback? onNotifications;

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    return TalentPulseTopBar(
      avatarLabel: avatarLabel,
      onNotifications:
          onNotifications ?? () => showComingSoon(context, 'Notifications'),
      showTitle: false,
    );
  }
}

class CandidateBottomBar extends StatelessWidget {
  const CandidateBottomBar({
    super.key,
    required this.onSelected,
    this.selectedItem,
  });

  final ValueChanged<CandidateNavigationItem> onSelected;
  final CandidateNavigationItem? selectedItem;

  static const _items = <(IconData, IconData, String)>[
    (Icons.home_outlined, Icons.home_rounded, 'Ana Sayfa'),
    (Icons.work_outline_rounded, Icons.work_rounded, 'İşler'),
    (Icons.search_rounded, Icons.search_rounded, 'Arama'),
    (Icons.account_circle_outlined, Icons.account_circle_rounded, 'Profil'),
  ];

  @override
  Widget build(BuildContext context) {
    return TalentPulseBottomBar(
      items: _items,
      selectedIndex: selectedItem?.index ?? -1,
      onSelected: (index) => onSelected(CandidateNavigationItem.values[index]),
    );
  }
}

class CandidateScaffold extends StatelessWidget {
  const CandidateScaffold({
    super.key,
    required this.body,
    this.avatarLabel = 'A',
    this.bottomActions,
    this.onNotifications,
    this.selectedItem,
  });

  final String avatarLabel;
  final Widget body;
  final Widget? bottomActions;
  final VoidCallback? onNotifications;
  final CandidateNavigationItem? selectedItem;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CandidateTopBar(
        avatarLabel: avatarLabel,
        onNotifications: onNotifications,
      ),
      body: body,
      bottomNavigationBar: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ?bottomActions,
          CandidateBottomBar(
            selectedItem: selectedItem,
            onSelected: (item) =>
                _openCandidateDestination(context, item, selectedItem),
          ),
        ],
      ),
    );
  }
}

CandidateNavigationItem candidateNavigationItemOf(
  BuildContext context, {
  required CandidateNavigationItem fallback,
}) {
  final arguments = ModalRoute.of(context)?.settings.arguments;
  return arguments is CandidateNavigationItem ? arguments : fallback;
}

void _openCandidateDestination(
  BuildContext context,
  CandidateNavigationItem destination,
  CandidateNavigationItem? current,
) {
  if (destination == current) return;

  final routeName = switch (destination) {
    CandidateNavigationItem.home => '/candidate-dashboard',
    CandidateNavigationItem.jobs ||
    CandidateNavigationItem.search => '/job-search',
    CandidateNavigationItem.profile => '/cv-review',
  };

  Navigator.of(context).pushReplacementNamed(routeName, arguments: destination);
}

void showComingSoon(BuildContext context, String label) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(content: Text('$label is coming soon.')));
}
