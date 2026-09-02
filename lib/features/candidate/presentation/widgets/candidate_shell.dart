import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/coming_soon_snackbar.dart';
import '../../../../core/widgets/vettingo_bottom_navigation_bar.dart';
import '../../../../core/widgets/vettingo_top_bar.dart';

enum CandidateNavigationItem { home, jobs, search, profile }

class CandidateTopBar extends StatelessWidget implements PreferredSizeWidget {
  const CandidateTopBar({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    return const VettingoTopBar();
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
    return VettingoBottomNavigationBar(
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
    showComingSoonSnackbar(context, label);
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
