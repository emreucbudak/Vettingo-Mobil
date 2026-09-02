import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/talent_pulse_shell.dart';
import '../../../candidate_detail/presentation/pages/candidate_detail_page.dart';
import '../../../employer/presentation/pages/employer_profile_page.dart';
import '../../../new_requisition/presentation/pages/new_requisition_page.dart';
import '../../../talent_comparison/presentation/pages/talent_comparison_page.dart';
import '../../domain/entities/employer_dashboard.dart';
import '../controllers/employer_dashboard_controller.dart';

class EmployerDashboardPage extends StatelessWidget {
  const EmployerDashboardPage({super.key, required this.controller});

  static const routeName = '/employer-dashboard';

  final EmployerDashboardController controller;

  @override
  Widget build(BuildContext context) {
    final dashboard = controller.dashboard;
    return Scaffold(
      appBar: const TalentPulseTopBar(
        showAvatar: false,
        showNotifications: false,
        title: 'Vettingo',
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 680),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _SummaryGrid(dashboard: dashboard),
                const SizedBox(height: 24),
                _SectionHeader(
                  title: 'Top AI Matches',
                  action: 'VIEW ALL',
                  onAction: () => showComingSoon(context, 'All matches'),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  height: 132,
                  child: ListView.separated(
                    key: const ValueKey('topMatchesList'),
                    scrollDirection: Axis.horizontal,
                    itemCount: dashboard.topMatches.length,
                    separatorBuilder: (_, _) => const SizedBox(width: 16),
                    itemBuilder: (context, index) => _MatchCard(
                      match: dashboard.topMatches[index],
                      onTap: () => Navigator.of(
                        context,
                      ).pushNamed(CandidateDetailPage.routeName),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                _SectionHeader(
                  title: 'Active Requisitions',
                  action: 'FILTER',
                  actionIcon: Icons.filter_list_rounded,
                  onAction: () => showComingSoon(context, 'Filters'),
                ),
                const SizedBox(height: 12),
                Container(
                  clipBehavior: Clip.antiAlias,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: AppColors.outlineVariant),
                  ),
                  child: Column(
                    children: List.generate(dashboard.requisitions.length, (
                      index,
                    ) {
                      return _RequisitionTile(
                        requisition: dashboard.requisitions[index],
                        showDivider: index < dashboard.requisitions.length - 1,
                        onTap: () => Navigator.of(
                          context,
                        ).pushNamed(TalentComparisonPage.routeName),
                      );
                    }),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  height: 42,
                  child: OutlinedButton(
                    onPressed: () =>
                        showComingSoon(context, 'All requisitions'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.tertiary,
                      side: const BorderSide(color: AppColors.outlineVariant),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4),
                      ),
                      textStyle: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        letterSpacing: .6,
                      ),
                    ),
                    child: const Text('VIEW ALL REQUISITIONS'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: TalentPulseBottomBar(
        onSelected: (index) {
          if (index == 1) {
            Navigator.of(context).pushNamed(NewRequisitionPage.routeName);
            return;
          }
          if (index == 3) {
            Navigator.of(
              context,
            ).pushReplacementNamed(EmployerProfilePage.routeName);
            return;
          }
          if (index == 2) {
            showComingSoon(context, 'Başvurular');
          }
        },
      ),
    );
  }
}

class _SummaryGrid extends StatelessWidget {
  const _SummaryGrid({required this.dashboard});

  final EmployerDashboard dashboard;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: _cardDecoration,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const _MetricLabel('TOTAL APPLICATIONS'),
              const SizedBox(height: 8),
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    _formatNumber(dashboard.totalApplications),
                    style: const TextStyle(
                      color: AppColors.primary,
                      fontSize: 32,
                      height: 1.25,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.successSurface,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.trending_up_rounded,
                          size: 14,
                          color: AppColors.success,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          dashboard.growthLabel,
                          style: const TextStyle(
                            color: AppColors.success,
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: _SmallMetricCard(
                label: 'OPEN ROLES',
                value: '${dashboard.openRoles}',
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _SmallMetricCard(
                label: 'AI PROCESSED',
                value: '${dashboard.aiProcessed}',
              ),
            ),
          ],
        ),
      ],
    );
  }

  static String _formatNumber(int value) {
    final text = value.toString();
    if (text.length <= 3) return text;
    return '${text.substring(0, text.length - 3)},${text.substring(text.length - 3)}';
  }
}

final _cardDecoration = BoxDecoration(
  color: Colors.white,
  borderRadius: BorderRadius.circular(6),
  border: Border.all(color: AppColors.outlineVariant),
);

class _MetricLabel extends StatelessWidget {
  const _MetricLabel(this.label);

  final String label;

  @override
  Widget build(BuildContext context) {
    return Text(
      label,
      style: const TextStyle(
        color: AppColors.onSurfaceVariant,
        fontSize: 12,
        height: 1.35,
        fontWeight: FontWeight.w600,
        letterSpacing: .6,
      ),
    );
  }
}

class _SmallMetricCard extends StatelessWidget {
  const _SmallMetricCard({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: _cardDecoration,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _MetricLabel(label),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              color: AppColors.primary,
              fontSize: 20,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({
    required this.title,
    required this.action,
    required this.onAction,
    this.actionIcon,
  });

  final String title;
  final String action;
  final VoidCallback onAction;
  final IconData? actionIcon;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(
            title,
            style: const TextStyle(
              color: AppColors.onSurface,
              fontSize: 18,
              height: 1.35,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        TextButton.icon(
          onPressed: onAction,
          iconAlignment: IconAlignment.end,
          icon: actionIcon == null
              ? const SizedBox.shrink()
              : Icon(actionIcon, size: 16),
          label: Text(action),
          style: TextButton.styleFrom(
            foregroundColor: AppColors.tertiary,
            padding: EdgeInsets.zero,
            minimumSize: Size.zero,
            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            textStyle: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              letterSpacing: .6,
            ),
          ),
        ),
      ],
    );
  }
}

class _MatchCard extends StatelessWidget {
  const _MatchCard({required this.match, required this.onTap});

  final TalentMatch match;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 290,
      child: Material(
        color: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(6),
          side: const BorderSide(color: AppColors.outlineVariant),
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(6),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 20,
                      backgroundColor: AppColors.surfaceHigh,
                      foregroundColor: AppColors.primary,
                      child: Text(
                        match.initials,
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ),
                    const SizedBox(width: 8),
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
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
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
                    _MatchPill(value: match.matchPercentage),
                  ],
                ),
                const Spacer(),
                Wrap(
                  spacing: 5,
                  children: match.skills
                      .map((skill) => _SkillTag(label: skill))
                      .toList(growable: false),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _MatchPill extends StatelessWidget {
  const _MatchPill({required this.value});

  final int value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.successSurface,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        '$value% Match',
        style: const TextStyle(
          color: AppColors.success,
          fontSize: 10,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class _SkillTag extends StatelessWidget {
  const _SkillTag({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.surfaceLow,
        borderRadius: BorderRadius.circular(3),
      ),
      child: Text(
        label,
        style: const TextStyle(
          color: AppColors.onSurfaceVariant,
          fontSize: 11,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}

class _RequisitionTile extends StatelessWidget {
  const _RequisitionTile({
    required this.requisition,
    required this.showDivider,
    required this.onTap,
  });

  final JobRequisition requisition;
  final bool showDivider;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final interviewing = requisition.status == 'Interviewing';
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: showDivider
              ? const Border(
                  bottom: BorderSide(color: AppColors.outlineVariant),
                )
              : null,
        ),
        child: Column(
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Text(
                    requisition.role,
                    style: const TextStyle(
                      color: AppColors.primary,
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Row(
                  children: [
                    CircleAvatar(
                      radius: 4,
                      backgroundColor: interviewing
                          ? AppColors.warning
                          : AppColors.success,
                    ),
                    const SizedBox(width: 5),
                    Text(
                      requisition.status,
                      style: const TextStyle(
                        color: AppColors.onSurfaceVariant,
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: Text(
                    requisition.location,
                    style: const TextStyle(
                      color: AppColors.onSurfaceVariant,
                      fontSize: 13,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 7,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceLow,
                    borderRadius: BorderRadius.circular(3),
                  ),
                  child: Text(
                    requisition.candidateLabel,
                    style: const TextStyle(
                      color: AppColors.onSurfaceVariant,
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
