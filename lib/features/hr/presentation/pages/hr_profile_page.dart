import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../widgets/hr_shell.dart';

class HrProfilePage extends StatelessWidget {
  const HrProfilePage({super.key});

  static const routeName = '/hr-profile';

  @override
  Widget build(BuildContext context) {
    return HrScaffold(
      selectedItem: HrNavigationItem.profile,
      body: SingleChildScrollView(
        key: const ValueKey('hrProfilePage'),
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 720),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _ProfileHeader(
                  onEdit: () => showHrMessage(
                    context,
                    'Profil düzenleme ekranı yakında hazır olacak.',
                  ),
                ),
                const SizedBox(height: 12),
                const _WorkspaceCard(),
                const SizedBox(height: 24),
                const _GroupLabel('Çalışma Alanı'),
                const SizedBox(height: 8),
                _SettingsGroup(
                  children: [
                    _SettingsTile(
                      key: const ValueKey('hrCompanyProfileTile'),
                      icon: Icons.apartment_outlined,
                      label: 'Şirket Profili',
                      subtitle: 'Şirket bilgileri ve marka ayarları',
                      onTap: () => showHrMessage(
                        context,
                        'Şirket profili yakında kullanıma açılacak.',
                      ),
                    ),
                    _SettingsTile(
                      icon: Icons.group_outlined,
                      label: 'Ekip ve Yetkiler',
                      subtitle: 'İK ekibini ve erişim rollerini yönet',
                      onTap: () => showHrMessage(
                        context,
                        'Ekip yönetimi yakında kullanıma açılacak.',
                      ),
                    ),
                    _SettingsTile(
                      icon: Icons.tune_rounded,
                      label: 'İşe Alım Tercihleri',
                      subtitle: 'Aday akışı ve değerlendirme ayarları',
                      onTap: () => showHrMessage(
                        context,
                        'İşe alım tercihleri yakında kullanıma açılacak.',
                      ),
                      showDivider: false,
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                const _GroupLabel('Hesap'),
                const SizedBox(height: 8),
                _SettingsGroup(
                  children: [
                    _SettingsTile(
                      icon: Icons.notifications_outlined,
                      label: 'Bildirimler',
                      subtitle: 'E-posta ve mobil bildirim tercihleri',
                      onTap: () => showHrMessage(
                        context,
                        'Bildirim ayarları yakında kullanıma açılacak.',
                      ),
                    ),
                    _SettingsTile(
                      icon: Icons.lock_outline_rounded,
                      label: 'Güvenlik',
                      subtitle: 'Şifre ve oturum güvenliği',
                      onTap: () => showHrMessage(
                        context,
                        'Güvenlik ayarları yakında kullanıma açılacak.',
                      ),
                    ),
                    _SettingsTile(
                      icon: Icons.help_outline_rounded,
                      label: 'Yardım Merkezi',
                      subtitle: 'Destek ve sık sorulan sorular',
                      onTap: () => showHrMessage(
                        context,
                        'Yardım merkezi yakında kullanıma açılacak.',
                      ),
                      showDivider: false,
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                OutlinedButton.icon(
                  key: const ValueKey('hrSignOutButton'),
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
    );
  }
}

class _ProfileHeader extends StatelessWidget {
  const _ProfileHeader({required this.onEdit});

  final VoidCallback onEdit;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          const CircleAvatar(
            radius: 30,
            backgroundColor: Colors.white,
            foregroundColor: AppColors.primary,
            child: Text(
              'EY',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
          ),
          const SizedBox(width: 14),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Elif Yılmaz',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'İK Yöneticisi',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'elif.yilmaz@acmetech.com',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(color: Colors.white60, fontSize: 11),
                ),
              ],
            ),
          ),
          IconButton(
            tooltip: 'Profili düzenle',
            onPressed: onEdit,
            style: IconButton.styleFrom(
              foregroundColor: Colors.white,
              backgroundColor: Colors.white.withValues(alpha: .12),
            ),
            icon: const Icon(Icons.edit_outlined, size: 19),
          ),
        ],
      ),
    );
  }
}

class _WorkspaceCard extends StatelessWidget {
  const _WorkspaceCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: const Row(
        children: [
          CircleAvatar(
            radius: 21,
            backgroundColor: AppColors.surfaceHighest,
            foregroundColor: AppColors.primary,
            child: Icon(Icons.apartment_rounded, size: 21),
          ),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Acme Teknoloji',
                  style: TextStyle(
                    color: AppColors.onSurface,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: 3),
                Text(
                  'Kurumsal Çalışma Alanı',
                  style: TextStyle(
                    color: AppColors.onSurfaceVariant,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '6',
                style: TextStyle(
                  color: AppColors.primary,
                  fontSize: 17,
                  fontWeight: FontWeight.w700,
                ),
              ),
              Text(
                'ekip üyesi',
                style: TextStyle(
                  color: AppColors.onSurfaceVariant,
                  fontSize: 9,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _GroupLabel extends StatelessWidget {
  const _GroupLabel(this.label);

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

class _SettingsGroup extends StatelessWidget {
  const _SettingsGroup({required this.children});

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

class _SettingsTile extends StatelessWidget {
  const _SettingsTile({
    super.key,
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.onTap,
    this.showDivider = true,
  });

  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool showDivider;
  final String subtitle;

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
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: const TextStyle(
                      color: AppColors.onSurface,
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      color: AppColors.onSurfaceVariant,
                      fontSize: 10,
                    ),
                  ),
                ],
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
