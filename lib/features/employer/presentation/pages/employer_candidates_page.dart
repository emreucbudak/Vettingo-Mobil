import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../candidate_detail/presentation/pages/candidate_detail_page.dart';
import '../../../dashboard/presentation/controllers/employer_dashboard_controller.dart';
import '../widgets/employer_shell.dart';

enum _CandidateStage { all, screening, interview, offer }

class EmployerCandidatesPage extends StatefulWidget {
  const EmployerCandidatesPage({super.key, required this.controller});

  static const routeName = '/employer-candidates';

  final EmployerDashboardController controller;

  @override
  State<EmployerCandidatesPage> createState() => _EmployerCandidatesPageState();
}

class _EmployerCandidatesPageState extends State<EmployerCandidatesPage> {
  final TextEditingController _searchController = TextEditingController();
  _CandidateStage _stage = _CandidateStage.all;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final candidates = _visibleCandidates();

    return EmployerScaffold(
      selectedItem: EmployerNavigationItem.candidates,
      body: CustomScrollView(
        key: const ValueKey('employerCandidatesPage'),
        slivers: [
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 20, 16, 8),
            sliver: SliverToBoxAdapter(
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 720),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      TextField(
                        key: const ValueKey('employerCandidateSearchField'),
                        controller: _searchController,
                        onChanged: (_) => setState(() {}),
                        textInputAction: TextInputAction.search,
                        decoration: InputDecoration(
                          hintText: 'Aday ara',
                          prefixIcon: const Icon(Icons.search_rounded),
                          suffixIcon: IconButton(
                            key: const ValueKey(
                              'employerCandidateFilterButton',
                            ),
                            tooltip: 'Filtreler',
                            onPressed: _showFilterSheet,
                            icon: Badge.count(
                              count: _stage == _CandidateStage.all ? 0 : 1,
                              isLabelVisible: _stage != _CandidateStage.all,
                              child: const Icon(Icons.tune_rounded),
                            ),
                          ),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: const BorderSide(
                              color: AppColors.outlineVariant,
                            ),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: const BorderSide(
                              color: AppColors.outlineVariant,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          Text(
                            '${candidates.length} aday',
                            key: const ValueKey('employerCandidateResultCount'),
                            style: const TextStyle(
                              color: AppColors.onSurface,
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const Spacer(),
                          if (_stage != _CandidateStage.all)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 9,
                                vertical: 5,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.surfaceHighest,
                                borderRadius: BorderRadius.circular(999),
                              ),
                              child: Text(
                                _stageLabel(_stage),
                                style: const TextStyle(
                                  color: AppColors.primary,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          if (candidates.isEmpty)
            const SliverFillRemaining(
              hasScrollBody: false,
              child: _EmptyCandidates(),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
              sliver: SliverList.separated(
                itemCount: candidates.length,
                separatorBuilder: (_, _) => const SizedBox(height: 10),
                itemBuilder: (context, index) => Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 720),
                    child: _EmployerCandidateCard(
                      key: ValueKey('employerCandidateCard$index'),
                      candidate: candidates[index],
                      onTap: () => Navigator.of(
                        context,
                      ).pushNamed(CandidateDetailPage.routeName),
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  List<_EmployerCandidate> _visibleCandidates() {
    final matches = widget.controller.dashboard.topMatches;
    final candidates = <_EmployerCandidate>[
      _EmployerCandidate(
        initials: matches[0].initials,
        name: matches[0].name,
        currentRole: matches[0].role,
        appliedRole: 'Senior Product Designer',
        matchPercentage: matches[0].matchPercentage,
        stage: _CandidateStage.interview,
        skills: matches[0].skills,
      ),
      _EmployerCandidate(
        initials: matches[1].initials,
        name: matches[1].name,
        currentRole: matches[1].role,
        appliedRole: 'Frontend Engineer',
        matchPercentage: matches[1].matchPercentage,
        stage: _CandidateStage.screening,
        skills: matches[1].skills,
      ),
      const _EmployerCandidate(
        initials: 'ZK',
        name: 'Zeynep Kaya',
        currentRole: 'Senior Data Analyst',
        appliedRole: 'Lead Data Scientist',
        matchPercentage: 91,
        stage: _CandidateStage.offer,
        skills: ['Python', 'SQL', 'ML'],
      ),
      const _EmployerCandidate(
        initials: 'CD',
        name: 'Can Demir',
        currentRole: 'Engineering Manager',
        appliedRole: 'VP of Engineering',
        matchPercentage: 88,
        stage: _CandidateStage.interview,
        skills: ['Leadership', 'Cloud', '+2'],
      ),
    ];

    final query = _searchController.text.trim().toLowerCase();
    return candidates
        .where((candidate) {
          final matchesQuery =
              query.isEmpty ||
              candidate.name.toLowerCase().contains(query) ||
              candidate.currentRole.toLowerCase().contains(query) ||
              candidate.appliedRole.toLowerCase().contains(query) ||
              candidate.skills.any(
                (skill) => skill.toLowerCase().contains(query),
              );
          final matchesStage =
              _stage == _CandidateStage.all || candidate.stage == _stage;
          return matchesQuery && matchesStage;
        })
        .toList(growable: false);
  }

  Future<void> _showFilterSheet() {
    return showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      backgroundColor: AppColors.surface,
      builder: (sheetContext) => StatefulBuilder(
        builder: (context, setSheetState) => SafeArea(
          top: false,
          child: Padding(
            key: const ValueKey('employerCandidateFilterSheet'),
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Adayları Filtrele',
                  style: TextStyle(
                    color: AppColors.onSurface,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  'İşe alım aşamasına göre aday listesini daralt.',
                  style: TextStyle(
                    color: AppColors.onSurfaceVariant,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _CandidateStage.values
                      .map(
                        (stage) => ChoiceChip(
                          key: ValueKey(
                            'employerCandidateFilter-${stage.name}',
                          ),
                          selected: _stage == stage,
                          label: Text(_stageLabel(stage)),
                          onSelected: (_) {
                            setState(() => _stage = stage);
                            setSheetState(() {});
                          },
                          selectedColor: AppColors.surfaceHighest,
                          side: const BorderSide(
                            color: AppColors.outlineVariant,
                          ),
                        ),
                      )
                      .toList(growable: false),
                ),
                const SizedBox(height: 20),
                FilledButton(
                  onPressed: () => Navigator.of(sheetContext).pop(),
                  child: const Text('Sonuçları Göster'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _stageLabel(_CandidateStage stage) {
    return switch (stage) {
      _CandidateStage.all => 'Tümü',
      _CandidateStage.screening => 'Ön Eleme',
      _CandidateStage.interview => 'Mülakat',
      _CandidateStage.offer => 'Teklif',
    };
  }
}

class _EmployerCandidate {
  const _EmployerCandidate({
    required this.initials,
    required this.name,
    required this.currentRole,
    required this.appliedRole,
    required this.matchPercentage,
    required this.stage,
    required this.skills,
  });

  final String appliedRole;
  final String currentRole;
  final String initials;
  final int matchPercentage;
  final String name;
  final List<String> skills;
  final _CandidateStage stage;
}

class _EmployerCandidateCard extends StatelessWidget {
  const _EmployerCandidateCard({
    super.key,
    required this.candidate,
    required this.onTap,
  });

  final _EmployerCandidate candidate;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final stageStyle = _styleFor(candidate.stage);

    return Material(
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: AppColors.outlineVariant),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(15),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: 23,
                    backgroundColor: AppColors.surfaceHighest,
                    foregroundColor: AppColors.primary,
                    child: Text(
                      candidate.initials,
                      style: const TextStyle(
                        fontSize: 11,
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
                          candidate.name,
                          style: const TextStyle(
                            color: AppColors.onSurface,
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          candidate.currentRole,
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
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.successSurface,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      '${candidate.matchPercentage}%',
                      style: const TextStyle(
                        color: AppColors.success,
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 9,
                ),
                decoration: BoxDecoration(
                  color: AppColors.surfaceLow,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.work_outline_rounded,
                      size: 16,
                      color: AppColors.onSurfaceVariant,
                    ),
                    const SizedBox(width: 7),
                    Expanded(
                      child: Text(
                        candidate.appliedRole,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: AppColors.onSurfaceVariant,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: stageStyle.surface,
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        stageStyle.label,
                        style: TextStyle(
                          color: stageStyle.foreground,
                          fontSize: 9,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 11),
              Row(
                children: [
                  Expanded(
                    child: Wrap(
                      spacing: 6,
                      runSpacing: 5,
                      children: candidate.skills
                          .take(3)
                          .map(
                            (skill) => Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 7,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(5),
                                border: Border.all(
                                  color: AppColors.outlineVariant,
                                ),
                              ),
                              child: Text(
                                skill,
                                style: const TextStyle(
                                  color: AppColors.onSurfaceVariant,
                                  fontSize: 9,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          )
                          .toList(growable: false),
                    ),
                  ),
                  const Icon(
                    Icons.chevron_right_rounded,
                    color: AppColors.onSurfaceVariant,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  _CandidateStageStyle _styleFor(_CandidateStage stage) {
    return switch (stage) {
      _CandidateStage.all => const _CandidateStageStyle(
        label: 'Tümü',
        foreground: AppColors.primary,
        surface: AppColors.surfaceHighest,
      ),
      _CandidateStage.screening => const _CandidateStageStyle(
        label: 'Ön Eleme',
        foreground: Color(0xFF315DA8),
        surface: Color(0xFFEAF1FF),
      ),
      _CandidateStage.interview => const _CandidateStageStyle(
        label: 'Mülakat',
        foreground: Color(0xFF9A5500),
        surface: Color(0xFFFFF2DD),
      ),
      _CandidateStage.offer => const _CandidateStageStyle(
        label: 'Teklif',
        foreground: AppColors.success,
        surface: AppColors.successSurface,
      ),
    };
  }
}

class _CandidateStageStyle {
  const _CandidateStageStyle({
    required this.label,
    required this.foreground,
    required this.surface,
  });

  final Color foreground;
  final String label;
  final Color surface;
}

class _EmptyCandidates extends StatelessWidget {
  const _EmptyCandidates();

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.person_search_rounded,
              size: 44,
              color: AppColors.outline,
            ),
            SizedBox(height: 12),
            Text(
              'Aday bulunamadı',
              style: TextStyle(
                color: AppColors.onSurface,
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
            SizedBox(height: 5),
            Text(
              'Arama veya filtre ölçütlerini değiştirerek tekrar dene.',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppColors.onSurfaceVariant, fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}
