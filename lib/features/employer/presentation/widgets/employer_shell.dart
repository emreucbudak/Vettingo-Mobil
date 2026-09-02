import 'package:flutter/material.dart';

import '../../../../core/widgets/vettingo_bottom_navigation_bar.dart';
import '../../../../core/widgets/vettingo_top_bar.dart';

enum EmployerNavigationItem { home, jobs, candidates, profile }

class EmployerScaffold extends StatelessWidget {
  const EmployerScaffold({
    super.key,
    required this.body,
    required this.selectedItem,
    this.floatingActionButton,
    this.floatingActionButtonLocation,
  });

  final Widget body;
  final Widget? floatingActionButton;
  final FloatingActionButtonLocation? floatingActionButtonLocation;
  final EmployerNavigationItem selectedItem;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const EmployerTopBar(),
      body: body,
      floatingActionButton: floatingActionButton,
      floatingActionButtonLocation: floatingActionButtonLocation,
      bottomNavigationBar: EmployerBottomBar(selectedItem: selectedItem),
    );
  }
}

class EmployerTopBar extends StatelessWidget implements PreferredSizeWidget {
  const EmployerTopBar({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    return const VettingoTopBar();
  }
}

class EmployerBottomBar extends StatelessWidget {
  const EmployerBottomBar({
    super.key,
    required this.selectedItem,
    this.onSelected,
  });

  final ValueChanged<EmployerNavigationItem>? onSelected;
  final EmployerNavigationItem selectedItem;

  static const _items = <(IconData, IconData, String)>[
    (Icons.home_outlined, Icons.home_rounded, 'Ana Sayfa'),
    (Icons.work_outline_rounded, Icons.work_rounded, 'İlanlar'),
    (Icons.groups_outlined, Icons.groups_rounded, 'Adaylar'),
    (Icons.person_outline_rounded, Icons.person_rounded, 'Profil'),
  ];

  @override
  Widget build(BuildContext context) {
    return VettingoBottomNavigationBar(
      items: _items,
      selectedIndex: selectedItem.index,
      onSelected: (index) {
        final destination = EmployerNavigationItem.values[index];
        final handler = onSelected;
        if (handler != null) {
          handler(destination);
          return;
        }
        _openEmployerDestination(context, destination, selectedItem);
      },
    );
  }
}

void _openEmployerDestination(
  BuildContext context,
  EmployerNavigationItem destination,
  EmployerNavigationItem current,
) {
  if (destination == current) return;

  final routeName = switch (destination) {
    EmployerNavigationItem.home => '/employer-dashboard',
    EmployerNavigationItem.jobs => '/employer-jobs',
    EmployerNavigationItem.candidates => '/employer-candidates',
    EmployerNavigationItem.profile => '/employer-profile',
  };
  Navigator.of(context).pushReplacementNamed(routeName, arguments: destination);
}
