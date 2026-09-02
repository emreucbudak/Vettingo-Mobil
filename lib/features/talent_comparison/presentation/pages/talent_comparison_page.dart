import 'package:flutter/material.dart';

import '../../../employer/presentation/pages/employer_candidates_page.dart';
import '../../../employer/presentation/pages/employer_jobs_page.dart';
import '../../domain/entities/talent_comparison.dart';
import '../controllers/talent_comparison_controller.dart';

class TalentComparisonPage extends StatefulWidget {
  const TalentComparisonPage({super.key, required this.controller});

  static const routeName = '/talent-comparison';

  final TalentComparisonController controller;

  @override
  State<TalentComparisonPage> createState() => _TalentComparisonPageState();
}

class _TalentComparisonPageState extends State<TalentComparisonPage> {
  static const _primary = Color(0xFF091426);
  static const _onSurface = Color(0xFF0B1C30);
  static const _onSurfaceVariant = Color(0xFF45474C);
  static const _outline = Color(0xFFC5C6CD);
  static const _outlineText = Color(0xFF75777D);
  static const _surface = Color(0xFFF8F9FF);
  static const _surfaceLow = Color(0xFFEFF4FF);
  static const _surfaceHigh = Color(0xFFDCE9FF);
  static const _surfaceHighest = Color(0xFFD3E4FE);
  static const _success = Color(0xFF10B981);
  static const _successSurface = Color(0xFFDCFCE7);

  late final TalentComparisonController _controller;
  late final PageController _pageController;

  @override
  void initState() {
    super.initState();
    _controller = widget.controller;
    _pageController = PageController(
      initialPage: _controller.currentIndex,
      viewportFraction: .9,
    );
  }

  @override
  void dispose() {
    _pageController.dispose();
    _controller.dispose();
    super.dispose();
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));
  }

  void _decide(CandidateDecision decision) {
    final candidate = _controller.currentCandidate;
    if (decision == CandidateDecision.rejected) {
      _controller.rejectCurrent();
      _showMessage('${candidate.name} was rejected.');
    } else {
      _controller.advanceCurrent();
      _showMessage('${candidate.name} advanced to the next stage.');
    }

    final nextIndex = _controller.currentIndex + 1;
    if (nextIndex < _controller.comparison.candidates.length) {
      _pageController.animateToPage(
        nextIndex,
        duration: const Duration(milliseconds: 320),
        curve: Curves.easeOutCubic,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, _) {
        return Scaffold(
          backgroundColor: _surface,
          appBar: AppBar(
            toolbarHeight: 64,
            elevation: 0,
            scrolledUnderElevation: 0,
            backgroundColor: _surface,
            foregroundColor: _onSurfaceVariant,
            shape: const Border(bottom: BorderSide(color: _outline)),
            leading: IconButton(
              key: const ValueKey('comparisonBackButton'),
              tooltip: 'Back',
              onPressed: () {
                if (Navigator.of(context).canPop()) {
                  Navigator.of(context).pop();
                }
              },
              icon: const Icon(Icons.arrow_back_rounded),
            ),
            titleSpacing: 0,
            title: const Text(
              'Compare Talent',
              style: TextStyle(
                color: _primary,
                fontSize: 20,
                height: 1.4,
                fontWeight: FontWeight.w600,
                letterSpacing: -.2,
              ),
            ),
            actions: [
              PopupMenuButton<String>(
                tooltip: 'More options',
                icon: const Icon(Icons.more_vert_rounded),
                onSelected: (value) => _showMessage(
                  value == 'share'
                      ? 'Comparison link is ready to share.'
                      : 'Candidate notes are not available yet.',
                ),
                itemBuilder: (context) => const [
                  PopupMenuItem(
                    value: 'share',
                    child: Text('Share comparison'),
                  ),
                  PopupMenuItem(value: 'notes', child: Text('View notes')),
                ],
              ),
              const SizedBox(width: 4),
            ],
          ),
          body: SafeArea(
            top: false,
            child: LayoutBuilder(
              builder: (context, constraints) {
                return SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(16, 24, 16, 24),
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 720),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          _RoleContext(model: _controller.comparison),
                          const SizedBox(height: 24),
                          SizedBox(
                            height: 500,
                            child: PageView.builder(
                              key: const ValueKey('candidateCarousel'),
                              controller: _pageController,
                              itemCount:
                                  _controller.comparison.candidates.length,
                              onPageChanged: _controller.selectCandidate,
                              itemBuilder: (context, index) {
                                final selected =
                                    index == _controller.currentIndex;
                                return AnimatedScale(
                                  duration: const Duration(milliseconds: 220),
                                  scale: selected ? 1 : .96,
                                  child: AnimatedOpacity(
                                    duration: const Duration(milliseconds: 220),
                                    opacity: selected ? 1 : .72,
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 6,
                                      ),
                                      child: _CandidateCard(
                                        candidate: _controller
                                            .comparison
                                            .candidates[index],
                                        decision: _controller.decisionFor(
                                          _controller
                                              .comparison
                                              .candidates[index],
                                        ),
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                          const SizedBox(height: 12),
                          _PageIndicators(
                            count: _controller.comparison.candidates.length,
                            currentIndex: _controller.currentIndex,
                            onSelected: (index) {
                              _pageController.animateToPage(
                                index,
                                duration: const Duration(milliseconds: 280),
                                curve: Curves.easeOutCubic,
                              );
                            },
                          ),
                          const SizedBox(height: 24),
                          _ActionArea(
                            decision: _controller.currentDecision,
                            onReject: () => _decide(CandidateDecision.rejected),
                            onAdvance: () =>
                                _decide(CandidateDecision.advanced),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          bottomNavigationBar: _ComparisonBottomBar(
            onUnavailable: (label) =>
                _showMessage('$label yakında kullanıma açılacak.'),
            onJobs: () => Navigator.of(
              context,
            ).pushReplacementNamed(EmployerJobsPage.routeName),
            onCandidates: () => Navigator.of(
              context,
            ).pushReplacementNamed(EmployerCandidatesPage.routeName),
            onProfile: () =>
                Navigator.of(context).pushReplacementNamed('/employer-profile'),
          ),
        );
      },
    );
  }
}

class _RoleContext extends StatelessWidget {
  const _RoleContext({required this.model});

  final TalentComparison model;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: _TalentComparisonPageState._outline),
      ),
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
                      model.jobTitle,
                      style: const TextStyle(
                        color: _TalentComparisonPageState._onSurface,
                        fontSize: 18,
                        height: 1.35,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      model.location,
                      style: const TextStyle(
                        color: _TalentComparisonPageState._onSurfaceVariant,
                        fontSize: 14,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
                decoration: BoxDecoration(
                  color: _TalentComparisonPageState._surfaceHigh,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  model.status.toUpperCase(),
                  style: const TextStyle(
                    color: _TalentComparisonPageState._onSurface,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    letterSpacing: .4,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Text(
            'BENCHMARKING AGAINST',
            style: TextStyle(
              color: _TalentComparisonPageState._outlineText,
              fontSize: 11,
              fontWeight: FontWeight.w500,
              letterSpacing: .7,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: model.benchmarkSkills
                .map((skill) => _SkillChip(label: skill))
                .toList(growable: false),
          ),
        ],
      ),
    );
  }
}

class _SkillChip extends StatelessWidget {
  const _SkillChip({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: _TalentComparisonPageState._surfaceLow,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: _TalentComparisonPageState._outline),
      ),
      child: Text(
        label,
        style: const TextStyle(
          color: _TalentComparisonPageState._onSurfaceVariant,
          fontSize: 12,
          height: 1.3,
          fontWeight: FontWeight.w600,
          letterSpacing: .2,
        ),
      ),
    );
  }
}

class _CandidateCard extends StatelessWidget {
  const _CandidateCard({required this.candidate, required this.decision});

  final TalentCandidate candidate;
  final CandidateDecision decision;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _TalentComparisonPageState._outline),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0D000000),
            blurRadius: 8,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              _CandidateAvatar(candidate: candidate),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      candidate.name,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: _TalentComparisonPageState._onSurface,
                        fontSize: 18,
                        height: 1.3,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      candidate.role,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: _TalentComparisonPageState._onSurfaceVariant,
                        fontSize: 14,
                        height: 1.35,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 22),
          _MatchBadge(percentage: candidate.matchPercentage),
          const SizedBox(height: 22),
          ...candidate.skills.map(
            (skill) => Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: _SkillProgress(skill: skill),
            ),
          ),
          const Spacer(),
          const Divider(height: 1, color: _TalentComparisonPageState._outline),
          const SizedBox(height: 18),
          Row(
            children: [
              const Text(
                'KEY STRENGTH',
                style: TextStyle(
                  color: _TalentComparisonPageState._outlineText,
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                  letterSpacing: .7,
                ),
              ),
              if (decision != CandidateDecision.pending) ...[
                const Spacer(),
                _DecisionLabel(decision: decision),
              ],
            ],
          ),
          const SizedBox(height: 8),
          Text(
            candidate.keyStrength,
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              color: _TalentComparisonPageState._onSurface,
              fontSize: 14,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }
}

class _CandidateAvatar extends StatelessWidget {
  const _CandidateAvatar({required this.candidate});

  final TalentCandidate candidate;

  @override
  Widget build(BuildContext context) {
    final fallback = Container(
      color: _TalentComparisonPageState._surfaceHighest,
      alignment: Alignment.center,
      child: Text(
        candidate.initials,
        style: const TextStyle(
          color: _TalentComparisonPageState._primary,
          fontSize: 18,
          fontWeight: FontWeight.w600,
        ),
      ),
    );

    return Container(
      width: 64,
      height: 64,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: _TalentComparisonPageState._outline),
      ),
      child: Image.network(
        candidate.imageUrl,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) => fallback,
      ),
    );
  }
}

class _MatchBadge extends StatelessWidget {
  const _MatchBadge({required this.percentage});

  final int percentage;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 6),
      decoration: BoxDecoration(
        color: _TalentComparisonPageState._successSurface,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(
            Icons.verified_rounded,
            size: 16,
            color: _TalentComparisonPageState._success,
          ),
          const SizedBox(width: 5),
          Text(
            '$percentage% Match',
            style: const TextStyle(
              color: _TalentComparisonPageState._success,
              fontSize: 12,
              fontWeight: FontWeight.w600,
              letterSpacing: .2,
            ),
          ),
        ],
      ),
    );
  }
}

class _SkillProgress extends StatelessWidget {
  const _SkillProgress({required this.skill});

  final TalentSkill skill;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(child: _ProgressLabel(skill.name)),
            _ProgressLabel(skill.level),
          ],
        ),
        const SizedBox(height: 7),
        ClipRRect(
          borderRadius: BorderRadius.circular(999),
          child: LinearProgressIndicator(
            minHeight: 8,
            value: skill.score,
            backgroundColor: _TalentComparisonPageState._surfaceHigh,
            valueColor: const AlwaysStoppedAnimation(
              _TalentComparisonPageState._primary,
            ),
          ),
        ),
      ],
    );
  }
}

class _ProgressLabel extends StatelessWidget {
  const _ProgressLabel(this.label);

  final String label;

  @override
  Widget build(BuildContext context) {
    return Text(
      label.toUpperCase(),
      style: const TextStyle(
        color: _TalentComparisonPageState._onSurfaceVariant,
        fontSize: 11,
        fontWeight: FontWeight.w500,
        letterSpacing: .5,
      ),
    );
  }
}

class _DecisionLabel extends StatelessWidget {
  const _DecisionLabel({required this.decision});

  final CandidateDecision decision;

  @override
  Widget build(BuildContext context) {
    final advanced = decision == CandidateDecision.advanced;
    return Text(
      advanced ? 'ADVANCED' : 'REJECTED',
      style: TextStyle(
        color: advanced
            ? _TalentComparisonPageState._success
            : const Color(0xFFBA1A1A),
        fontSize: 10,
        fontWeight: FontWeight.w700,
        letterSpacing: .5,
      ),
    );
  }
}

class _PageIndicators extends StatelessWidget {
  const _PageIndicators({
    required this.count,
    required this.currentIndex,
    required this.onSelected,
  });

  final int count;
  final int currentIndex;
  final ValueChanged<int> onSelected;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(count, (index) {
        final selected = index == currentIndex;
        return Semantics(
          label: 'Candidate ${index + 1} of $count',
          selected: selected,
          button: true,
          child: InkWell(
            borderRadius: BorderRadius.circular(999),
            onTap: () => onSelected(index),
            child: Padding(
              padding: const EdgeInsets.all(5),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 180),
                width: selected ? 18 : 8,
                height: 8,
                decoration: BoxDecoration(
                  color: selected
                      ? _TalentComparisonPageState._primary
                      : _TalentComparisonPageState._outline,
                  borderRadius: BorderRadius.circular(999),
                ),
              ),
            ),
          ),
        );
      }),
    );
  }
}

class _ActionArea extends StatelessWidget {
  const _ActionArea({
    required this.decision,
    required this.onReject,
    required this.onAdvance,
  });

  final CandidateDecision decision;
  final VoidCallback onReject;
  final VoidCallback onAdvance;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: SizedBox(
            height: 48,
            child: OutlinedButton(
              key: const ValueKey('rejectCandidateButton'),
              onPressed: onReject,
              style: OutlinedButton.styleFrom(
                foregroundColor: _TalentComparisonPageState._primary,
                backgroundColor: decision == CandidateDecision.rejected
                    ? _TalentComparisonPageState._surfaceHigh
                    : Colors.white,
                side: const BorderSide(
                  color: _TalentComparisonPageState._primary,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                textStyle: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  letterSpacing: .6,
                ),
              ),
              child: Text(
                decision == CandidateDecision.rejected ? 'REJECTED' : 'REJECT',
              ),
            ),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: SizedBox(
            height: 48,
            child: FilledButton(
              key: const ValueKey('advanceCandidateButton'),
              onPressed: onAdvance,
              style: FilledButton.styleFrom(
                backgroundColor: _TalentComparisonPageState._primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                textStyle: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  letterSpacing: .5,
                ),
              ),
              child: Text(
                decision == CandidateDecision.advanced
                    ? 'ADVANCED'
                    : 'ADVANCE TO NEXT',
                textAlign: TextAlign.center,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _ComparisonBottomBar extends StatelessWidget {
  const _ComparisonBottomBar({
    required this.onUnavailable,
    required this.onJobs,
    required this.onCandidates,
    required this.onProfile,
  });

  final ValueChanged<String> onUnavailable;
  final VoidCallback onJobs;
  final VoidCallback onCandidates;
  final VoidCallback onProfile;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: const BoxDecoration(
        color: _TalentComparisonPageState._surface,
        border: Border(
          top: BorderSide(color: _TalentComparisonPageState._outline),
        ),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 72,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _BottomItem(
                icon: Icons.home_outlined,
                label: 'Ana Sayfa',
                onTap: () => onUnavailable('Ana Sayfa'),
              ),
              _BottomItem(
                icon: Icons.work_outline_rounded,
                label: 'İlanlar',
                onTap: onJobs,
              ),
              _BottomItem(
                icon: Icons.groups_rounded,
                label: 'Adaylar',
                selected: true,
                onTap: onCandidates,
              ),
              _BottomItem(
                icon: Icons.person_outline_rounded,
                label: 'Profil',
                onTap: onProfile,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _BottomItem extends StatelessWidget {
  const _BottomItem({
    required this.icon,
    required this.label,
    this.selected = false,
    this.onTap,
  });

  final IconData icon;
  final String label;
  final bool selected;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      selected: selected,
      button: true,
      child: InkWell(
        borderRadius: BorderRadius.circular(999),
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          width: 64,
          height: 64,
          decoration: BoxDecoration(
            color: selected
                ? _TalentComparisonPageState._surfaceHighest
                : Colors.transparent,
            borderRadius: BorderRadius.circular(999),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 24,
                color: selected
                    ? _TalentComparisonPageState._primary
                    : _TalentComparisonPageState._onSurfaceVariant,
              ),
              const SizedBox(height: 3),
              Text(
                label,
                style: TextStyle(
                  color: selected
                      ? _TalentComparisonPageState._primary
                      : _TalentComparisonPageState._onSurfaceVariant,
                  fontSize: 11,
                  fontWeight: selected ? FontWeight.w600 : FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
