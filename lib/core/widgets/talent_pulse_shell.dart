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
    this.title = 'Vettingo',
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
                tooltip: 'Bildirimler',
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
    (Icons.home_outlined, Icons.home_rounded, 'Ana Sayfa'),
    (Icons.description_outlined, Icons.description_rounded, 'Başvurular'),
    (Icons.search_rounded, Icons.search_rounded, 'Arama'),
    (Icons.work_outline_rounded, Icons.work_rounded, 'İlanlar'),
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
                  child: SizedBox(
                    width: 64,
                    height: 64,
                    child: Center(
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 180),
                        width: selected ? 56 : 64,
                        height: selected ? 60 : 56,
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
                              width: selected ? 52 : 60,
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
                onSavedJobs: () =>
                    _closeAndShowComingSoon('Kaydedilen ilanlar'),
                onInterviews: () => _closeAndShowComingSoon('Mülakatlarım'),
                onMessages: () => _closeAndShowComingSoon('Mesajlarım'),
                onMenuNotifications: () =>
                    _closeAndShowComingSoon('Bildirimler'),
                onHelp: () => _closeAndShowComingSoon('Yardım merkezi'),
                onSettings: () => _closeAndShowComingSoon('Ayarlar'),
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
    required this.onSavedJobs,
    required this.onInterviews,
    required this.onMessages,
    required this.onMenuNotifications,
    required this.onHelp,
    required this.onSettings,
    required this.onSignOut,
  });

  final VoidCallback onHelp;
  final VoidCallback onInterviews;
  final VoidCallback onMenuNotifications;
  final VoidCallback onMessages;
  final VoidCallback onProfile;
  final VoidCallback onSavedJobs;
  final VoidCallback onSettings;
  final VoidCallback onSignOut;

  @override
  Widget build(BuildContext context) {
    return SizedBox.expand(
      key: const ValueKey('candidateProfileMenu'),
      child: Material(
        color: AppColors.surface,
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 720),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const _CandidateProfileHeader(),
                  const SizedBox(height: 24),
                  const _CandidateProfileGroupLabel('Kariyer'),
                  const SizedBox(height: 8),
                  _CandidateProfileMenuGroup(
                    key: const ValueKey('candidateCareerSettingsGroup'),
                    children: [
                      _CandidateProfileMenuTile(
                        key: const ValueKey('candidateProfileMenuProfile'),
                        icon: Icons.account_circle_outlined,
                        label: 'Profilim',
                        onTap: onProfile,
                      ),
                      _CandidateProfileMenuTile(
                        icon: Icons.bookmark_border_rounded,
                        label: 'Kaydedilen İlanlar',
                        onTap: onSavedJobs,
                      ),
                      _CandidateProfileMenuTile(
                        icon: Icons.event_available_outlined,
                        label: 'Mülakatlarım',
                        onTap: onInterviews,
                      ),
                      _CandidateProfileMenuTile(
                        icon: Icons.chat_bubble_outline_rounded,
                        label: 'Mesajlarım',
                        onTap: onMessages,
                        showDivider: false,
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  const _CandidateProfileGroupLabel('Hesap'),
                  const SizedBox(height: 8),
                  _CandidateProfileMenuGroup(
                    key: const ValueKey('candidateAccountSettingsGroup'),
                    children: [
                      _CandidateProfileMenuTile(
                        icon: Icons.notifications_none_rounded,
                        label: 'Bildirimler',
                        onTap: onMenuNotifications,
                      ),
                      _CandidateProfileMenuTile(
                        icon: Icons.help_outline_rounded,
                        label: 'Yardım Merkezi',
                        onTap: onHelp,
                      ),
                      _CandidateProfileMenuTile(
                        icon: Icons.settings_outlined,
                        label: 'Ayarlar',
                        onTap: onSettings,
                        showDivider: false,
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  OutlinedButton.icon(
                    key: const ValueKey('candidateProfileMenuSignOut'),
                    onPressed: onSignOut,
                    icon: const Icon(Icons.logout_rounded),
                    label: const Text('Çıkış Yap'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFFBA1A1A),
                      side: const BorderSide(color: Color(0xFFE6B8B8)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      textStyle: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _CandidateProfileHeader extends StatelessWidget {
  const _CandidateProfileHeader();

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('candidateProfileHeader'),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(14),
      ),
      child: const Row(
        children: [
          CircleAvatar(
            radius: 30,
            backgroundColor: Colors.white,
            foregroundColor: AppColors.primary,
            child: Text(
              'A',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
          ),
          SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Alex',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Aday Hesabı',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'alex@example.com',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(color: Colors.white60, fontSize: 11),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _CandidateProfileGroupLabel extends StatelessWidget {
  const _CandidateProfileGroupLabel(this.label);

  final String label;

  @override
  Widget build(BuildContext context) {
    return Text(
      label.toUpperCase(),
      style: const TextStyle(
        color: AppColors.onSurfaceVariant,
        fontSize: 10,
        fontWeight: FontWeight.w700,
        letterSpacing: .8,
      ),
    );
  }
}

class _CandidateProfileMenuGroup extends StatelessWidget {
  const _CandidateProfileMenuGroup({super.key, required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: Column(children: children),
    );
  }
}

class _CandidateProfileMenuTile extends StatelessWidget {
  const _CandidateProfileMenuTile({
    super.key,
    required this.icon,
    required this.label,
    required this.onTap,
    this.showDivider = true,
  });

  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool showDivider;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          border: showDivider
              ? const Border(
                  bottom: BorderSide(color: AppColors.outlineVariant),
                )
              : null,
        ),
        child: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: AppColors.surfaceLow,
                borderRadius: BorderRadius.circular(9),
              ),
              child: Icon(icon, size: 20, color: AppColors.primary),
            ),
            const SizedBox(width: 11),
            Expanded(
              child: Text(
                label,
                style: const TextStyle(
                  color: AppColors.onSurface,
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            const Icon(
              Icons.chevron_right_rounded,
              size: 20,
              color: AppColors.onSurfaceVariant,
            ),
          ],
        ),
      ),
    );
  }
}

void showComingSoon(BuildContext context, String label) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(content: Text('$label is coming soon.')));
}
