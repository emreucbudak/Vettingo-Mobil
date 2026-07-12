import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/talent_pulse_shell.dart';
import '../../domain/entities/candidate_dashboard.dart';
import '../controllers/candidate_dashboard_controller.dart';

class CandidateDashboardPage extends StatelessWidget {
  const CandidateDashboardPage({super.key, required this.controller});

  static const routeName = '/candidate-dashboard';

  final CandidateDashboardController controller;

  @override
  Widget build(BuildContext context) {
    final dashboard = controller.dashboard;
    return Scaffold(
      appBar: TalentPulseTopBar(
        avatarLabel: dashboard.userName.substring(0, 1).toUpperCase(),
        onNotifications: () => showComingSoon(context, 'Notifications'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 680),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  dashboard.dateLabel,
                  style: const TextStyle(
                    color: AppColors.onSurfaceVariant,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Welcome back, ${dashboard.userName}.',
                  style: const TextStyle(
                    color: AppColors.primary,
                    fontSize: 20,
                    height: 1.4,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  dashboard.summary,
                  style: const TextStyle(
                    color: AppColors.onSurfaceVariant,
                    fontSize: 14,
                    height: 1.45,
                  ),
                ),
                const SizedBox(height: 24),
                _CandidateSectionHeader(
                  title: 'Active Applications',
                  action: 'View All',
                  onAction: () => showComingSoon(context, 'All applications'),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  height: 196,
                  child: ListView.separated(
                    key: const ValueKey('activeApplicationsList'),
                    scrollDirection: Axis.horizontal,
                    itemCount: dashboard.applications.length,
                    separatorBuilder: (_, _) => const SizedBox(width: 16),
                    itemBuilder: (context, index) => _ApplicationCard(
                      application: dashboard.applications[index],
                      onTap: () =>
                          showComingSoon(context, 'Application details'),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                Text('Your Market Profile', style: _sectionTitleStyle),
                const SizedBox(height: 10),
                _MarketProfileCard(profile: dashboard.marketProfile),
                const SizedBox(height: 24),
                const Row(
                  children: [
                    Expanded(
                      child: Text(
                        'Recommended Matches',
                        style: _sectionTitleStyle,
                      ),
                    ),
                    Icon(
                      Icons.auto_awesome_rounded,
                      color: AppColors.primary,
                      size: 20,
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                ...dashboard.recommendations.map(
                  (recommendation) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: _RecommendationTile(
                      recommendation: recommendation,
                      onTap: () => showComingSoon(context, 'Job details'),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: TalentPulseBottomBar(
        onSelected: (index) {
          if (index != 0) {
            showComingSoon(
              context,
              const ['Home', 'Apps', 'Search', 'Jobs'][index],
            );
          }
        },
      ),
    );
  }
}

const _sectionTitleStyle = TextStyle(
  color: AppColors.primary,
  fontSize: 18,
  height: 1.35,
  fontWeight: FontWeight.w500,
);

class _CandidateSectionHeader extends StatelessWidget {
  const _CandidateSectionHeader({
    required this.title,
    required this.action,
    required this.onAction,
  });

  final String title;
  final String action;
  final VoidCallback onAction;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: Text(title, style: _sectionTitleStyle)),
        TextButton(
          onPressed: onAction,
          style: TextButton.styleFrom(
            foregroundColor: AppColors.primary,
            padding: EdgeInsets.zero,
            minimumSize: Size.zero,
            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            textStyle: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
          child: Text(action),
        ),
      ],
    );
  }
}

class _ApplicationCard extends StatelessWidget {
  const _ApplicationCard({required this.application, required this.onTap});

  final JobApplication application;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 286,
      child: Material(
        color: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(6),
          side: const BorderSide(color: AppColors.outlineVariant),
        ),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(6),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            application.role,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              color: AppColors.primary,
                              fontSize: 16,
                              height: 1.3,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${application.company} • ${application.location}',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              color: AppColors.onSurfaceVariant,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: AppColors.surfaceLow,
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: AppColors.outlineVariant),
                      ),
                      child: Center(
                        child: Text(
                          application.company.substring(0, 1),
                          style: const TextStyle(
                            color: AppColors.primary,
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        application.status,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: AppColors.primary,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Flexible(
                      child: Text(
                        application.stageLabel,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.right,
                        style: const TextStyle(
                          color: AppColors.onSurfaceVariant,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                LinearProgressIndicator(
                  value: application.progress,
                  minHeight: 8,
                  backgroundColor: AppColors.surfaceHigh,
                  valueColor: const AlwaysStoppedAnimation(AppColors.primary),
                  borderRadius: BorderRadius.circular(999),
                ),
                const SizedBox(height: 10),
                Text(
                  application.nextStep,
                  style: const TextStyle(
                    color: AppColors.onSurfaceVariant,
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
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

class _MarketProfileCard extends StatelessWidget {
  const _MarketProfileCard({required this.profile});

  final MarketProfile profile;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: Row(
        children: [
          SizedBox.square(
            dimension: 104,
            child: Stack(
              alignment: Alignment.center,
              children: [
                SizedBox.square(
                  dimension: 88,
                  child: CircularProgressIndicator(
                    value: profile.score / 100,
                    strokeWidth: 8,
                    strokeCap: StrokeCap.round,
                    backgroundColor: AppColors.surfaceHigh,
                    valueColor: const AlwaysStoppedAnimation(AppColors.primary),
                  ),
                ),
                Text(
                  '${profile.score}',
                  style: const TextStyle(
                    color: AppColors.primary,
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  profile.title,
                  style: const TextStyle(
                    color: AppColors.primary,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  profile.description,
                  style: const TextStyle(
                    color: AppColors.onSurfaceVariant,
                    fontSize: 11,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 5,
                  runSpacing: 5,
                  children: profile.skills.entries
                      .map(
                        (entry) => _ProfileSkill(
                          label: '${entry.key} ${entry.value}%',
                        ),
                      )
                      .toList(growable: false),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ProfileSkill extends StatelessWidget {
  const _ProfileSkill({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.successSurface,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: const TextStyle(
          color: AppColors.success,
          fontSize: 11,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}

class _RecommendationTile extends StatelessWidget {
  const _RecommendationTile({
    required this.recommendation,
    required this.onTap,
  });

  final JobRecommendation recommendation;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(6),
        side: const BorderSide(color: AppColors.outlineVariant),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(6),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppColors.surfaceLow,
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(color: AppColors.outlineVariant),
                ),
                child: const Icon(
                  Icons.hub_outlined,
                  color: AppColors.primary,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      recommendation.role,
                      style: const TextStyle(
                        color: AppColors.primary,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${recommendation.company} • ${recommendation.location}',
                      style: const TextStyle(
                        color: AppColors.onSurfaceVariant,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 5),
                    Wrap(
                      spacing: 8,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      children: [
                        _ProfileSkill(
                          label: '${recommendation.matchPercentage}% Match',
                        ),
                        Text(
                          recommendation.salary,
                          style: const TextStyle(
                            color: AppColors.onSurfaceVariant,
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.chevron_right_rounded,
                color: AppColors.outlineVariant,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
