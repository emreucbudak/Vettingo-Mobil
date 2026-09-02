import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../candidate_detail/presentation/pages/candidate_detail_page.dart';
import '../../../dashboard/domain/entities/employer_dashboard.dart';
import '../../../dashboard/presentation/controllers/employer_dashboard_controller.dart';
import '../widgets/hr_shell.dart';

class HrDashboardPage extends StatelessWidget {
  const HrDashboardPage({super.key, required this.controller});

  static const routeName = '/hr-dashboard';

  final EmployerDashboardController controller;

  @override
  Widget build(BuildContext context) {
    final dashboard = controller.dashboard;
    return HrScaffold(
      selectedItem: HrNavigationItem.dashboard,
      body: SingleChildScrollView(
        key: const ValueKey('hrDashboardPage'),
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 720),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _MetricsGrid(dashboard: dashboard),
                const SizedBox(height: 24),
                const _SectionHeader(title: 'Yaklaşan Mülakatlar'),
                const SizedBox(height: 12),
                const _InterviewCard(
                  time: '10:30',
                  name: 'Sarah Jenkins',
                  role: 'Senior Product Designer',
                  type: 'Teknik görüşme',
                ),
                const SizedBox(height: 8),
                const _InterviewCard(
                  time: '15:00',
                  name: 'Michael Ross',
                  role: 'Frontend Engineer',
                  type: 'İK görüşmesi',
                ),
                const SizedBox(height: 24),
                _SectionHeader(
                  title: 'Öne Çıkan Adaylar',
                  actionLabel: 'Tümünü Gör',
                  onAction: () => Navigator.of(
                    context,
                  ).pushReplacementNamed('/hr-candidates'),
                ),
                const SizedBox(height: 12),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.outlineVariant),
                  ),
                  child: Column(
                    children: dashboard.topMatches.indexed
                        .map(
                          (entry) => _CandidateTile(
                            match: entry.$2,
                            showDivider:
                                entry.$1 < dashboard.topMatches.length - 1,
                            onTap: () => Navigator.of(
                              context,
                            ).pushNamed(CandidateDetailPage.routeName),
                          ),
                        )
                        .toList(growable: false),
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

class _MetricsGrid extends StatelessWidget {
  const _MetricsGrid({required this.dashboard});

  final EmployerDashboard dashboard;

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      mainAxisSpacing: 10,
      crossAxisSpacing: 10,
      childAspectRatio: 1.48,
      children: [
        _MetricCard(
          icon: Icons.work_outline_rounded,
          label: 'Açık Pozisyon',
          value: dashboard.openRoles.toString(),
          accent: const Color(0xFF2563EB),
          surface: const Color(0xFFEFF6FF),
        ),
        const _MetricCard(
          icon: Icons.mark_email_unread_outlined,
          label: 'Yeni Başvuru',
          value: '36',
          accent: Color(0xFF7C3AED),
          surface: Color(0xFFF5F3FF),
        ),
        const _MetricCard(
          icon: Icons.calendar_month_outlined,
          label: 'Mülakat',
          value: '8',
          accent: Color(0xFFB45309),
          surface: Color(0xFFFFF7ED),
        ),
        const _MetricCard(
          icon: Icons.handshake_outlined,
          label: 'Teklif Aşaması',
          value: '5',
          accent: AppColors.success,
          surface: AppColors.successSurface,
        ),
      ],
    );
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.accent,
    required this.surface,
  });

  final Color accent;
  final IconData icon;
  final String label;
  final Color surface;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 34,
            height: 34,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: surface,
              borderRadius: BorderRadius.circular(9),
            ),
            child: Icon(icon, color: accent, size: 19),
          ),
          const Spacer(),
          Text(
            value,
            style: const TextStyle(
              color: AppColors.primary,
              fontSize: 24,
              height: 1,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 5),
          Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              color: AppColors.onSurfaceVariant,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.title, this.actionLabel, this.onAction});

  final String? actionLabel;
  final VoidCallback? onAction;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Expanded(
          child: Text(
            title,
            style: const TextStyle(
              color: AppColors.onSurface,
              fontSize: 18,
              height: 1.3,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
        if (actionLabel != null)
          TextButton(
            onPressed: onAction,
            style: TextButton.styleFrom(
              foregroundColor: AppColors.tertiary,
              padding: const EdgeInsets.only(left: 8),
              minimumSize: const Size(0, 32),
              textStyle: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
              ),
            ),
            child: Text(actionLabel!),
          ),
      ],
    );
  }
}

class _InterviewCard extends StatelessWidget {
  const _InterviewCard({
    required this.time,
    required this.name,
    required this.role,
    required this.type,
  });

  final String name;
  final String role;
  final String time;
  final String type;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: Row(
        children: [
          Container(
            width: 52,
            padding: const EdgeInsets.symmetric(vertical: 10),
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: AppColors.surfaceLow,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              time,
              style: const TextStyle(
                color: AppColors.primary,
                fontSize: 12,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.onSurface,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  role,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.onSurfaceVariant,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
            decoration: BoxDecoration(
              color: AppColors.surfaceHigh,
              borderRadius: BorderRadius.circular(999),
            ),
            child: Text(
              type,
              style: const TextStyle(
                color: AppColors.primary,
                fontSize: 9,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CandidateTile extends StatelessWidget {
  const _CandidateTile({
    required this.match,
    required this.showDivider,
    required this.onTap,
  });

  final TalentMatch match;
  final VoidCallback onTap;
  final bool showDivider;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          border: showDivider
              ? const Border(
                  bottom: BorderSide(color: AppColors.outlineVariant),
                )
              : null,
        ),
        child: Row(
          children: [
            CircleAvatar(
              radius: 21,
              backgroundColor: AppColors.surfaceHighest,
              foregroundColor: AppColors.primary,
              child: Text(
                match.initials,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            const SizedBox(width: 11),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    match.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: AppColors.onSurface,
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    match.role,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: AppColors.onSurfaceVariant,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.successSurface,
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(
                '${match.matchPercentage}% eşleşme',
                style: const TextStyle(
                  color: AppColors.success,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
