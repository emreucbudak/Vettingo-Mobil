import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/talent_pulse_shell.dart';
import '../../../new_requisition/presentation/pages/new_requisition_page.dart';

class EmployerProfilePage extends StatelessWidget {
  const EmployerProfilePage({super.key});

  static const routeName = '/employer-profile';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const TalentPulseTopBar(
        showAvatar: false,
        showNotifications: false,
        title: 'Vettingo',
      ),
      body: SingleChildScrollView(
        key: const ValueKey('employerProfilePage'),
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 720),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const _EmployerProfileHeader(),
                const SizedBox(height: 24),
                const _ProfileGroupLabel('Çalışma Alanı'),
                const SizedBox(height: 8),
                _ProfileMenuGroup(
                  key: const ValueKey('employerWorkplaceSettingsGroup'),
                  children: [
                    _ProfileMenuTile(
                      key: const ValueKey('employerCompanyProfileTile'),
                      icon: Icons.apartment_outlined,
                      label: 'Şirket Profili',
                      onTap: () => _showMessage(
                        context,
                        'Şirket profili yakında kullanıma açılacak.',
                      ),
                    ),
                    _ProfileMenuTile(
                      icon: Icons.group_outlined,
                      label: 'Ekip ve Yetkiler',
                      onTap: () => _showMessage(
                        context,
                        'Ekip yönetimi yakında kullanıma açılacak.',
                      ),
                    ),
                    _ProfileMenuTile(
                      icon: Icons.tune_rounded,
                      label: 'İşe Alım Tercihleri',
                      onTap: () => _showMessage(
                        context,
                        'İşe alım tercihleri yakında kullanıma açılacak.',
                      ),
                      showDivider: false,
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                const _ProfileGroupLabel('Hesap'),
                const SizedBox(height: 8),
                _ProfileMenuGroup(
                  key: const ValueKey('employerAccountSettingsGroup'),
                  children: [
                    _ProfileMenuTile(
                      key: const ValueKey('employerProfileSettingsTile'),
                      icon: Icons.person_outline_rounded,
                      label: 'Profil',
                      onTap: () => _showMessage(
                        context,
                        'Profil ayarları yakında kullanıma açılacak.',
                      ),
                    ),
                    _ProfileMenuTile(
                      icon: Icons.notifications_outlined,
                      label: 'Bildirimler',
                      onTap: () => _showMessage(
                        context,
                        'Bildirim ayarları yakında kullanıma açılacak.',
                      ),
                    ),
                    _ProfileMenuTile(
                      icon: Icons.lock_outline_rounded,
                      label: 'Güvenlik',
                      onTap: () => _showMessage(
                        context,
                        'Güvenlik ayarları yakında kullanıma açılacak.',
                      ),
                    ),
                    _ProfileMenuTile(
                      icon: Icons.help_outline_rounded,
                      label: 'Yardım Merkezi',
                      onTap: () => _showMessage(
                        context,
                        'Yardım merkezi yakında kullanıma açılacak.',
                      ),
                      showDivider: false,
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                OutlinedButton.icon(
                  key: const ValueKey('employerSignOutButton'),
                  onPressed: () => Navigator.of(
                    context,
                  ).pushNamedAndRemoveUntil('/login', (route) => false),
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
      bottomNavigationBar: TalentPulseBottomBar(
        selectedIndex: 3,
        onSelected: (index) => _openDestination(context, index),
      ),
    );
  }

  void _openDestination(BuildContext context, int index) {
    if (index == 3) return;
    if (index == 0) {
      Navigator.of(context).pushReplacementNamed('/employer-dashboard');
      return;
    }
    if (index == 1) {
      Navigator.of(context).pushNamed(NewRequisitionPage.routeName);
      return;
    }

    _showMessage(context, 'Başvurular yakında kullanıma açılacak.');
  }
}

class _EmployerProfileHeader extends StatelessWidget {
  const _EmployerProfileHeader();

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('employerProfileHeader'),
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
              'AT',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
          ),
          SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Acme Teknoloji',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'İşveren Hesabı',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'ik@acmetech.com',
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

class _ProfileGroupLabel extends StatelessWidget {
  const _ProfileGroupLabel(this.label);

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

class _ProfileMenuGroup extends StatelessWidget {
  const _ProfileMenuGroup({super.key, required this.children});

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

class _ProfileMenuTile extends StatelessWidget {
  const _ProfileMenuTile({
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

void _showMessage(BuildContext context, String message) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(content: Text(message)));
}
