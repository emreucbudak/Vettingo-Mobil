import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/candidate_detail.dart';
import '../controllers/candidate_detail_controller.dart';

class CandidateDetailPage extends StatelessWidget {
  const CandidateDetailPage({super.key, required this.controller});

  static const routeName = '/candidate-detail';

  final CandidateDetailController controller;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        final candidate = controller.candidate;
        return Scaffold(
          appBar: AppBar(
            toolbarHeight: 64,
            shape: const Border(
              bottom: BorderSide(color: AppColors.outlineVariant),
            ),
            leading: IconButton(
              tooltip: 'Go back',
              onPressed: () => Navigator.of(context).maybePop(),
              icon: const Icon(Icons.arrow_back_rounded),
            ),
            centerTitle: true,
            title: const Text(
              'Vettingo',
              style: TextStyle(
                color: AppColors.primary,
                fontSize: 20,
                fontWeight: FontWeight.w600,
              ),
            ),
            actions: [
              IconButton(
                key: const ValueKey('shareCandidateButton'),
                tooltip: 'Share candidate',
                onPressed: () => _shareCandidate(context),
                icon: const Icon(Icons.share_outlined),
              ),
              const SizedBox(width: 4),
            ],
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 720),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _CandidateHeader(candidate: candidate),
                    const SizedBox(height: 24),
                    const Divider(height: 1),
                    const SizedBox(height: 24),
                    _AnalysisCard(
                      title: 'AI Executive Summary',
                      icon: Icons.auto_awesome_rounded,
                      child: Text(
                        candidate.executiveSummary,
                        style: const TextStyle(
                          color: AppColors.onSurfaceVariant,
                          fontSize: 14,
                          height: 1.55,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    _SuitabilityCard(candidate: candidate),
                    const SizedBox(height: 16),
                    _ExpandableSection(
                      key: const ValueKey('candidateExperienceSection'),
                      title: 'Professional Experience',
                      expanded: controller.experienceExpanded,
                      onToggle: controller.toggleExperience,
                      child: _ProfessionalTimeline(
                        experiences: candidate.experiences,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _ExpandableSection(
                      key: const ValueKey('candidateEducationSection'),
                      title: 'Education & Certifications',
                      expanded: controller.educationExpanded,
                      onToggle: controller.toggleEducation,
                      child: Column(
                        children: candidate.education.indexed
                            .map((entry) {
                              final education = entry.$2;
                              return Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  if (entry.$1 > 0) const Divider(height: 24),
                                  Text(
                                    education.title,
                                    style: const TextStyle(
                                      color: AppColors.onSurface,
                                      fontSize: 16,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '${education.institution} • ${education.period}',
                                    style: const TextStyle(
                                      color: AppColors.onSurfaceVariant,
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              );
                            })
                            .toList(growable: false),
                      ),
                    ),
                    if (controller.pipelineAction !=
                        CandidatePipelineAction.none) ...[
                      const SizedBox(height: 16),
                      _PipelineStatus(controller: controller),
                    ],
                  ],
                ),
              ),
            ),
          ),
          bottomNavigationBar: _CandidateActions(
            action: controller.pipelineAction,
            onSchedule: () => _scheduleInterview(context),
            onAdvance: () {
              controller.advanceCandidate();
              _showMessage(context, 'Sarah advanced to the next stage.');
            },
          ),
        );
      },
    );
  }

  Future<void> _shareCandidate(BuildContext context) async {
    final candidate = controller.candidate;
    await Clipboard.setData(
      ClipboardData(
        text:
            '${candidate.name} — ${candidate.currentRole} — ${candidate.matchPercentage}% match',
      ),
    );
    if (context.mounted) _showMessage(context, 'Candidate summary copied.');
  }

  Future<void> _scheduleInterview(BuildContext context) async {
    final now = DateTime.now();
    final selected = await showDatePicker(
      context: context,
      initialDate: now.add(const Duration(days: 1)),
      firstDate: now,
      lastDate: now.add(const Duration(days: 365)),
      helpText: 'Schedule interview',
    );
    if (selected == null || !context.mounted) return;
    controller.scheduleInterview(selected);
    _showMessage(context, 'Interview scheduled.');
  }

  void _showMessage(BuildContext context, String message) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));
  }
}

class _CandidateHeader extends StatelessWidget {
  const _CandidateHeader({required this.candidate});

  final CandidateDetail candidate;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 96,
          height: 96,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [AppColors.surfaceHighest, AppColors.surfaceHigh],
            ),
            border: Border.all(color: AppColors.outlineVariant),
          ),
          child: Text(
            candidate.initials,
            style: const TextStyle(
              color: AppColors.primary,
              fontSize: 28,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        const SizedBox(height: 16),
        Text(
          candidate.name,
          textAlign: TextAlign.center,
          style: const TextStyle(
            color: AppColors.onSurface,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          candidate.currentRole,
          textAlign: TextAlign.center,
          style: const TextStyle(
            color: AppColors.onSurfaceVariant,
            fontSize: 14,
          ),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const CircleAvatar(radius: 4, backgroundColor: AppColors.success),
            const SizedBox(width: 8),
            Text(
              candidate.status.toUpperCase(),
              style: const TextStyle(
                color: AppColors.onSurfaceVariant,
                fontSize: 12,
                fontWeight: FontWeight.w600,
                letterSpacing: .6,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
          decoration: BoxDecoration(
            color: AppColors.successSurface,
            borderRadius: BorderRadius.circular(999),
            border: Border.all(color: AppColors.success.withValues(alpha: .2)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'SMART MATCH',
                style: TextStyle(
                  color: AppColors.success,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  letterSpacing: .6,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                '${candidate.matchPercentage}%',
                style: const TextStyle(
                  color: AppColors.success,
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _AnalysisCard extends StatelessWidget {
  const _AnalysisCard({required this.title, required this.child, this.icon});

  final String title;
  final Widget child;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              if (icon != null) ...[
                Icon(icon, color: AppColors.primary, size: 20),
                const SizedBox(width: 8),
              ],
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    color: AppColors.primary,
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}

class _SuitabilityCard extends StatelessWidget {
  const _SuitabilityCard({required this.candidate});

  final CandidateDetail candidate;

  @override
  Widget build(BuildContext context) {
    return _AnalysisCard(
      title: 'Role Suitability',
      icon: Icons.analytics_outlined,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: LinearProgressIndicator(
              value: candidate.matchPercentage / 100,
              minHeight: 16,
              backgroundColor: AppColors.surfaceHigh,
              valueColor: const AlwaysStoppedAnimation(AppColors.primary),
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Expanded(
                child: Text(
                  'Minimum Req',
                  style: TextStyle(
                    color: AppColors.onSurfaceVariant,
                    fontSize: 11,
                  ),
                ),
              ),
              Text(
                'Strong Match (${candidate.matchPercentage}%)',
                style: const TextStyle(
                  color: AppColors.primary,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ...candidate.requirements.indexed.map((entry) {
            final requirement = entry.$2;
            final exceeds = requirement.result == 'EXCEEDS';
            return Column(
              children: [
                if (entry.$1 > 0) const Divider(height: 17),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        requirement.name,
                        style: const TextStyle(
                          color: AppColors.onSurfaceVariant,
                          fontSize: 14,
                        ),
                      ),
                    ),
                    Text(
                      requirement.result,
                      style: TextStyle(
                        color: exceeds
                            ? AppColors.success
                            : AppColors.onSurfaceVariant,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ],
            );
          }),
        ],
      ),
    );
  }
}

class _ExpandableSection extends StatelessWidget {
  const _ExpandableSection({
    super.key,
    required this.title,
    required this.expanded,
    required this.onToggle,
    required this.child,
  });

  final String title;
  final bool expanded;
  final VoidCallback onToggle;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: Column(
        children: [
          InkWell(
            onTap: onToggle,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      title,
                      style: const TextStyle(
                        color: AppColors.primary,
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  AnimatedRotation(
                    turns: expanded ? .5 : 0,
                    duration: const Duration(milliseconds: 180),
                    child: const Icon(
                      Icons.expand_more_rounded,
                      color: AppColors.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          ),
          AnimatedCrossFade(
            firstChild: const SizedBox(width: double.infinity),
            secondChild: Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 20),
              decoration: const BoxDecoration(
                border: Border(
                  top: BorderSide(color: AppColors.outlineVariant),
                ),
              ),
              child: child,
            ),
            crossFadeState: expanded
                ? CrossFadeState.showSecond
                : CrossFadeState.showFirst,
            duration: const Duration(milliseconds: 180),
          ),
        ],
      ),
    );
  }
}

class _ProfessionalTimeline extends StatelessWidget {
  const _ProfessionalTimeline({required this.experiences});

  final List<CandidateProfessionalExperience> experiences;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: experiences.indexed
          .map((entry) {
            final experience = entry.$2;
            return IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  SizedBox(
                    width: 24,
                    child: Column(
                      children: [
                        Container(
                          width: 24,
                          height: 24,
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            border: Border.all(color: AppColors.outlineVariant),
                          ),
                          child: CircleAvatar(
                            radius: 4,
                            backgroundColor: entry.$1 == 0
                                ? AppColors.primary
                                : AppColors.outlineVariant,
                          ),
                        ),
                        if (entry.$1 < experiences.length - 1)
                          const Expanded(
                            child: VerticalDivider(
                              width: 1,
                              thickness: 1,
                              color: AppColors.outlineVariant,
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Padding(
                      padding: EdgeInsets.only(
                        bottom: entry.$1 < experiences.length - 1 ? 24 : 0,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            experience.role,
                            style: const TextStyle(
                              color: AppColors.onSurface,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${experience.company} • ${experience.period}',
                            style: const TextStyle(
                              color: AppColors.onSurfaceVariant,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            experience.description,
                            style: const TextStyle(
                              color: AppColors.onSurfaceVariant,
                              fontSize: 14,
                              height: 1.45,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          })
          .toList(growable: false),
    );
  }
}

class _PipelineStatus extends StatelessWidget {
  const _PipelineStatus({required this.controller});

  final CandidateDetailController controller;

  @override
  Widget build(BuildContext context) {
    final advanced =
        controller.pipelineAction == CandidatePipelineAction.advanced;
    final date = controller.scheduledDate;
    final message = advanced
        ? 'Candidate advanced to the next stage.'
        : date == null
        ? 'Interview scheduled.'
        : 'Interview scheduled for ${date.day}/${date.month}/${date.year}.';
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.successSurface,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        children: [
          Icon(
            advanced
                ? Icons.thumb_up_alt_outlined
                : Icons.event_available_outlined,
            color: AppColors.success,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(
                color: AppColors.onSurface,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CandidateActions extends StatelessWidget {
  const _CandidateActions({
    required this.action,
    required this.onSchedule,
    required this.onAdvance,
  });

  final CandidatePipelineAction action;
  final VoidCallback onSchedule;
  final VoidCallback onAdvance;

  @override
  Widget build(BuildContext context) {
    final advanced = action == CandidatePipelineAction.advanced;
    return DecoratedBox(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.outlineVariant)),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Expanded(
                child: SizedBox(
                  height: 48,
                  child: OutlinedButton.icon(
                    key: const ValueKey('scheduleCandidateButton'),
                    onPressed: onSchedule,
                    icon: const Icon(Icons.event_outlined, size: 18),
                    label: const Text('SCHEDULE'),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: SizedBox(
                  height: 48,
                  child: FilledButton.icon(
                    key: const ValueKey('advanceCandidateDetailButton'),
                    onPressed: advanced ? null : onAdvance,
                    icon: Icon(
                      advanced
                          ? Icons.check_rounded
                          : Icons.thumb_up_alt_outlined,
                      size: 18,
                    ),
                    label: Text(advanced ? 'ADVANCED' : 'ADVANCE'),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
