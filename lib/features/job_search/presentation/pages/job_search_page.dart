import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/talent_pulse_shell.dart';
import '../../domain/entities/job_search.dart';
import '../controllers/job_search_controller.dart';

class JobSearchPage extends StatefulWidget {
  const JobSearchPage({super.key, required this.controller});

  static const routeName = '/job-search';

  final JobSearchController controller;

  @override
  State<JobSearchPage> createState() => _JobSearchPageState();
}

class _JobSearchPageState extends State<JobSearchPage> {
  late final TextEditingController _searchController;

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController(text: widget.controller.query);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: widget.controller,
      builder: (context, _) {
        final controller = widget.controller;
        final matches = _matchesForCurrentState(controller);
        final selectedNavigationItem = candidateNavigationItemOf(
          context,
          fallback: CandidateNavigationItem.search,
        );
        return CandidateScaffold(
          selectedItem: selectedNavigationItem,
          body: CustomScrollView(
            slivers: [
              SliverPersistentHeader(
                pinned: true,
                delegate: _SearchHeaderDelegate(
                  searchController: _searchController,
                  controller: controller,
                  onFilters: () => _showFilters(context),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
                sliver: SliverToBoxAdapter(
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 680),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Row(
                            children: [
                              const Expanded(
                                child: Text(
                                  'Recommended Matches',
                                  style: _sectionTitleStyle,
                                ),
                              ),
                              Text(
                                '${matches.length} results',
                                style: const TextStyle(
                                  color: AppColors.primary,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          if (matches.isEmpty)
                            const _EmptySearchState()
                          else
                            ...matches.map(
                              (match) => Padding(
                                padding: const EdgeInsets.only(bottom: 8),
                                child: _JobMatchCard(
                                  match: match,
                                  onTap: () => showComingSoon(
                                    context,
                                    '${match.title} details',
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
            ],
          ),
        );
      },
    );
  }

  List<JobMatch> _matchesForCurrentState(JobSearchController controller) {
    final isReferenceDefault =
        controller.query.isEmpty &&
        controller.activeFilters.length == 1 &&
        controller.activeFilters.contains('Remote');
    return isReferenceDefault
        ? controller.content.matches
        : controller.visibleMatches;
  }

  Future<void> _showFilters(BuildContext context) {
    return showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      backgroundColor: AppColors.surface,
      builder: (sheetContext) => AnimatedBuilder(
        animation: widget.controller,
        builder: (context, _) => SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    const Expanded(
                      child: Text(
                        'Search Filters',
                        style: TextStyle(
                          color: AppColors.onSurface,
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    TextButton(
                      onPressed: widget.controller.clearFilters,
                      child: const Text('Clear all'),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: widget.controller.content.quickFilters
                      .map((filter) {
                        final selected = widget.controller.isFilterActive(
                          filter,
                        );
                        return FilterChip(
                          selected: selected,
                          label: Text(filter),
                          onSelected: (_) =>
                              widget.controller.toggleFilter(filter),
                        );
                      })
                      .toList(growable: false),
                ),
                const SizedBox(height: 24),
                FilledButton(
                  onPressed: () => Navigator.of(sheetContext).pop(),
                  child: const Text('Show results'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

const _sectionTitleStyle = TextStyle(
  color: AppColors.onSurface,
  fontSize: 18,
  height: 1.35,
  fontWeight: FontWeight.w500,
);

class _SearchHeaderDelegate extends SliverPersistentHeaderDelegate {
  _SearchHeaderDelegate({
    required this.searchController,
    required this.controller,
    required this.onFilters,
  });

  final TextEditingController searchController;
  final JobSearchController controller;
  final VoidCallback onFilters;

  @override
  double get minExtent => 112;

  @override
  double get maxExtent => 112;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return ColoredBox(
      color: AppColors.surface.withValues(alpha: .97),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 712),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
            child: Column(
              children: [
                DecoratedBox(
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: .82),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.outlineVariant),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x10000000),
                        blurRadius: 6,
                        offset: Offset(0, 2),
                      ),
                    ],
                  ),
                  child: TextField(
                    key: const ValueKey('jobSearchField'),
                    controller: searchController,
                    onChanged: controller.updateQuery,
                    textInputAction: TextInputAction.search,
                    decoration: InputDecoration(
                      hintText: 'VP Engineering, Remote',
                      prefixIcon: const Icon(Icons.search_rounded),
                      suffixIcon: IconButton(
                        key: const ValueKey('jobFilterButton'),
                        tooltip: 'Filters',
                        onPressed: onFilters,
                        icon: Badge.count(
                          count: controller.activeFilters.length,
                          isLabelVisible: controller.activeFilters.isNotEmpty,
                          child: const Icon(Icons.tune_rounded),
                        ),
                      ),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                SizedBox(
                  height: 34,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: controller.content.quickFilters.length,
                    separatorBuilder: (_, _) => const SizedBox(width: 8),
                    itemBuilder: (context, index) {
                      final filter = controller.content.quickFilters[index];
                      final selected = controller.isFilterActive(filter);
                      return FilterChip(
                        key: ValueKey('quickFilter$index'),
                        selected: selected,
                        label: Text(filter),
                        labelStyle: const TextStyle(fontSize: 11),
                        visualDensity: VisualDensity.compact,
                        onSelected: (_) => controller.toggleFilter(filter),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  bool shouldRebuild(covariant _SearchHeaderDelegate oldDelegate) => true;
}

class _JobMatchCard extends StatelessWidget {
  const _JobMatchCard({required this.match, required this.onTap});

  final JobMatch match;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      key: ValueKey('jobMatch-${match.id}'),
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: const BorderSide(color: AppColors.outlineVariant),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(8),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          match.title,
                          style: const TextStyle(
                            color: AppColors.primary,
                            fontSize: 20,
                            height: 1.35,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(
                              Icons.domain_outlined,
                              size: 16,
                              color: AppColors.onSurfaceVariant,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              match.company,
                              style: const TextStyle(
                                color: AppColors.onSurfaceVariant,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.successSurface,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      '${match.matchPercentage}% Match',
                      style: const TextStyle(
                        color: AppColors.success,
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  const Icon(
                    Icons.location_on_outlined,
                    size: 16,
                    color: AppColors.onSurfaceVariant,
                  ),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      '${match.location}  •  ${match.salary}',
                      style: const TextStyle(
                        color: AppColors.onSurfaceVariant,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 5,
                runSpacing: 5,
                children: match.tags
                    .map((tag) => _JobTag(label: tag))
                    .toList(growable: false),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _JobTag extends StatelessWidget {
  const _JobTag({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.outlineVariant),
        borderRadius: BorderRadius.circular(4),
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

class _EmptySearchState extends StatelessWidget {
  const _EmptySearchState();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: const Column(
        children: [
          Icon(Icons.search_off_rounded, color: AppColors.outline, size: 36),
          SizedBox(height: 8),
          Text(
            'No roles match these filters.',
            style: TextStyle(
              color: AppColors.onSurface,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
