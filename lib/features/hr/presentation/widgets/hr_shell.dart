import 'package:flutter/material.dart';

import '../../../../core/widgets/vettingo_bottom_navigation_bar.dart';
import '../../../../core/widgets/vettingo_top_bar.dart';

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
    return const VettingoTopBar(key: ValueKey('hrTopBar'));
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
    return VettingoBottomNavigationBar(
      key: const ValueKey('hrBottomBar'),
      items: _items,
      selectedIndex: selectedItem.index,
      itemKeyPrefix: 'hrBottomNav',
      indicatorKeyPrefix: 'hrBottomNavIndicator',
      onSelected: (index) => onSelected(HrNavigationItem.values[index]),
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
