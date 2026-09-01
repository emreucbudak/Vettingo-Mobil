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
    this.title = 'TalentPulse',
  });

  final String avatarLabel;
  final bool centerTitle;
  final VoidCallback? onNotifications;
  final bool showAvatar;
  final bool showNotifications;
  final bool showTitle;
  final String title;

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
          ? Text(
              title,
              style: const TextStyle(
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
                        SizedBox(
                          width: 60,
                          child: FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Text(
                              item.$3,
                              maxLines: 1,
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
  const CandidateTopBar({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    return const TalentPulseTopBar(
      showAvatar: false,
      showNotifications: false,
      title: 'Vettingo',
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
    (Icons.work_outline_rounded, Icons.work_rounded, 'Başvurularım'),
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

class CandidateScaffold extends StatefulWidget {
  const CandidateScaffold({
    super.key,
    required this.body,
    this.bottomActions,
    this.selectedItem,
  });

  final Widget body;
  final Widget? bottomActions;
  final CandidateNavigationItem? selectedItem;

  @override
  State<CandidateScaffold> createState() => _CandidateScaffoldState();
}

class _CandidateScaffoldState extends State<CandidateScaffold> {
  bool _profileMenuVisible = false;

  void _handleNavigation(CandidateNavigationItem destination) {
    if (destination == CandidateNavigationItem.profile) {
      setState(() => _profileMenuVisible = !_profileMenuVisible);
      return;
    }

    if (_profileMenuVisible) {
      setState(() => _profileMenuVisible = false);
    }

    _openCandidateDestination(context, destination, widget.selectedItem);
  }

  void _openProfile() {
    setState(() => _profileMenuVisible = false);
    if (ModalRoute.of(context)?.settings.name == '/cv-review') return;
    Navigator.of(context).pushReplacementNamed(
      '/cv-review',
      arguments: CandidateNavigationItem.profile,
    );
  }

  void _closeAndShowComingSoon(String label) {
    setState(() => _profileMenuVisible = false);
    showComingSoon(context, label);
  }

  void _signOut() {
    Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CandidateTopBar(),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 180),
        child: _profileMenuVisible
            ? _CandidateProfileMenu(
                onProfile: _openProfile,
                onApplications: () => _closeAndShowComingSoon('Başvurularım'),
                onSavedJobs: () =>
                    _closeAndShowComingSoon('Kaydedilen ilanlar'),
                onSettings: () => _closeAndShowComingSoon('Ayarlar'),
                onHelp: () => _closeAndShowComingSoon('Yardım merkezi'),
                onSignOut: _signOut,
              )
            : KeyedSubtree(
                key: const ValueKey('candidatePageBody'),
                child: widget.body,
              ),
      ),
      bottomNavigationBar: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (!_profileMenuVisible && widget.bottomActions != null)
            widget.bottomActions!,
          CandidateBottomBar(
            selectedItem: _profileMenuVisible
                ? CandidateNavigationItem.profile
                : widget.selectedItem,
            onSelected: _handleNavigation,
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
    CandidateNavigationItem.jobs => '/candidate-applications',
    CandidateNavigationItem.search => '/job-search',
    CandidateNavigationItem.profile => '/cv-review',
  };

  Navigator.of(context).pushReplacementNamed(routeName, arguments: destination);
}

class _CandidateProfileMenu extends StatelessWidget {
  const _CandidateProfileMenu({
    required this.onProfile,
    required this.onApplications,
    required this.onSavedJobs,
    required this.onSettings,
    required this.onHelp,
    required this.onSignOut,
  });

  final VoidCallback onApplications;
  final VoidCallback onHelp;
  final VoidCallback onProfile;
  final VoidCallback onSavedJobs;
  final VoidCallback onSettings;
  final VoidCallback onSignOut;

  @override
  Widget build(BuildContext context) {
    return Material(
      key: const ValueKey('candidateProfileMenu'),
      color: AppColors.surface,
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 24, 16, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Row(
                children: [
                  CircleAvatar(
                    radius: 24,
                    backgroundColor: AppColors.surfaceHighest,
                    foregroundColor: AppColors.primary,
                    child: Text(
                      'A',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Alex',
                          style: TextStyle(
                            color: AppColors.primary,
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Text(
                          'Aday Hesabı',
                          style: TextStyle(
                            color: AppColors.onSurfaceVariant,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const Divider(height: 1),
              const SizedBox(height: 8),
              _CandidateProfileMenuTile(
                key: const ValueKey('candidateProfileMenuProfile'),
                icon: Icons.account_circle_outlined,
                label: 'Profilim',
                subtitle: 'Profil ve CV bilgilerini görüntüle',
                onTap: onProfile,
              ),
              _CandidateProfileMenuTile(
                icon: Icons.assignment_outlined,
                label: 'Başvurularım',
                subtitle: 'İş başvurularını takip et',
                onTap: onApplications,
              ),
              _CandidateProfileMenuTile(
                icon: Icons.bookmark_border_rounded,
                label: 'Kaydedilen İlanlar',
                subtitle: 'Daha sonra bakmak için kaydettiklerin',
                onTap: onSavedJobs,
              ),
              _CandidateProfileMenuTile(
                icon: Icons.settings_outlined,
                label: 'Ayarlar',
                subtitle: 'Hesap ve bildirim tercihleri',
                onTap: onSettings,
              ),
              _CandidateProfileMenuTile(
                icon: Icons.help_outline_rounded,
                label: 'Yardım Merkezi',
                subtitle: 'Destek ve sık sorulan sorular',
                onTap: onHelp,
              ),
              const Divider(height: 17),
              _CandidateProfileMenuTile(
                key: const ValueKey('candidateProfileMenuSignOut'),
                icon: Icons.logout_rounded,
                label: 'Çıkış Yap',
                subtitle: 'Hesabından güvenli şekilde çık',
                foregroundColor: const Color(0xFFBA1A1A),
                onTap: onSignOut,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CandidateProfileMenuTile extends StatelessWidget {
  const _CandidateProfileMenuTile({
    super.key,
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.onTap,
    this.foregroundColor = AppColors.onSurface,
  });

  final Color foregroundColor;
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 4),
      leading: Container(
        width: 40,
        height: 40,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: foregroundColor.withValues(alpha: .08),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: foregroundColor),
      ),
      title: Text(
        label,
        style: TextStyle(
          color: foregroundColor,
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: const TextStyle(color: AppColors.onSurfaceVariant, fontSize: 12),
      ),
      trailing: Icon(Icons.chevron_right_rounded, color: foregroundColor),
      onTap: onTap,
    );
  }
}

void showComingSoon(BuildContext context, String label) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(content: Text('$label is coming soon.')));
}
