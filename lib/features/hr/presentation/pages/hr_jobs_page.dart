import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../dashboard/domain/entities/employer_dashboard.dart';
import '../../../dashboard/presentation/controllers/employer_dashboard_controller.dart';
import '../../../new_requisition/presentation/pages/new_requisition_page.dart';
import '../../../talent_comparison/presentation/pages/talent_comparison_page.dart';
import '../widgets/hr_shell.dart';

enum _JobFilter { all, sourcing, interviewing }

class HrJobsPage extends StatefulWidget {
  const HrJobsPage({super.key, required this.controller});

  static const routeName = '/hr-jobs';

  final EmployerDashboardController controller;

  @override
  State<HrJobsPage> createState() => _HrJobsPageState();
}

class _HrJobsPageState extends State<HrJobsPage> {
  final TextEditingController _searchController = TextEditingController();
  _JobFilter _filter = _JobFilter.all;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final jobs = _visibleJobs(widget.controller.dashboard.requisitions);
    return HrScaffold(
      selectedItem: HrNavigationItem.jobs,
      floatingActionButton: FloatingActionButton.extended(
        key: const ValueKey('hrNewJobButton'),
        onPressed: () =>
            Navigator.of(context).pushNamed(NewRequisitionPage.routeName),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_rounded),
        label: const Text(
          'Yeni İlan',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
      body: CustomScrollView(
        key: const ValueKey('hrJobsPage'),
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
                        key: const ValueKey('hrJobSearchField'),
                        controller: _searchController,
                        onChanged: (_) => setState(() {}),
                        textInputAction: TextInputAction.search,
                        decoration: InputDecoration(
                          hintText: 'Pozisyon veya konum ara',
                          prefixIcon: const Icon(Icons.search_rounded),
                          suffixIcon: _searchController.text.isEmpty
                              ? null
                              : IconButton(
                                  tooltip: 'Aramayı temizle',
                                  onPressed: () {
                                    _searchController.clear();
                                    setState(() {});
                                  },
                                  icon: const Icon(Icons.close_rounded),
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
                      const SizedBox(height: 12),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: _JobFilter.values
                              .map(
                                (filter) => Padding(
                                  padding: const EdgeInsets.only(right: 8),
                                  child: ChoiceChip(
                                    key: ValueKey('hrJobFilter-${filter.name}'),
                                    selected: _filter == filter,
                                    label: Text(_filterLabel(filter)),
                                    onSelected: (_) =>
                                        setState(() => _filter = filter),
                                    selectedColor: AppColors.surfaceHighest,
                                    side: const BorderSide(
                                      color: AppColors.outlineVariant,
                                    ),
                                    labelStyle: TextStyle(
                                      color: _filter == filter
                                          ? AppColors.primary
                                          : AppColors.onSurfaceVariant,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
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
          ),
          if (jobs.isEmpty)
            const SliverFillRemaining(hasScrollBody: false, child: _EmptyJobs())
          else
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 112),
              sliver: SliverList.separated(
                itemCount: jobs.length,
                separatorBuilder: (_, _) => const SizedBox(height: 10),
                itemBuilder: (context, index) => Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 720),
                    child: _JobCard(
                      key: ValueKey('hrJobCard$index'),
                      job: jobs[index],
                      onTap: () => Navigator.of(
                        context,
                      ).pushNamed(TalentComparisonPage.routeName),
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  List<JobRequisition> _visibleJobs(List<JobRequisition> jobs) {
    final query = _searchController.text.trim().toLowerCase();
    return jobs
        .where((job) {
          final matchesQuery =
              query.isEmpty ||
              job.role.toLowerCase().contains(query) ||
              job.location.toLowerCase().contains(query);
          final matchesFilter = switch (_filter) {
            _JobFilter.all => true,
            _JobFilter.sourcing => job.status == 'Sourcing',
            _JobFilter.interviewing => job.status == 'Interviewing',
          };
          return matchesQuery && matchesFilter;
        })
        .toList(growable: false);
  }

  String _filterLabel(_JobFilter filter) {
    return switch (filter) {
      _JobFilter.all => 'Tümü',
      _JobFilter.sourcing => 'Aday Aranıyor',
      _JobFilter.interviewing => 'Mülakat',
    };
  }
}

class _JobCard extends StatelessWidget {
  const _JobCard({super.key, required this.job, required this.onTap});

  final JobRequisition job;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final interviewing = job.status == 'Interviewing';
    final statusLabel = interviewing ? 'Mülakat' : 'Aday Aranıyor';
    final candidateLabel = job.candidateLabel == 'New'
        ? 'Yeni adaylar'
        : '${job.candidateLabel.replaceFirst('+', '')} aday';

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
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 42,
                    height: 42,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: AppColors.surfaceLow,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(
                      Icons.work_outline_rounded,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          job.role,
                          style: const TextStyle(
                            color: AppColors.onSurface,
                            fontSize: 16,
                            height: 1.3,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          _localizeLocation(job.location),
                          style: const TextStyle(
                            color: AppColors.onSurfaceVariant,
                            fontSize: 12,
                            height: 1.35,
                          ),
                        ),
                      ],
                    ),
                  ),
                  PopupMenuButton<String>(
                    tooltip: 'İlan işlemleri',
                    onSelected: (value) => showHrMessage(
                      context,
                      value == 'edit'
                          ? 'İlan düzenleme ekranı yakında hazır olacak.'
                          : 'İlan bağlantısı kopyalandı.',
                    ),
                    itemBuilder: (context) => const [
                      PopupMenuItem(
                        value: 'edit',
                        child: Text('İlanı düzenle'),
                      ),
                      PopupMenuItem(
                        value: 'share',
                        child: Text('İlanı paylaş'),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const Divider(height: 1),
              const SizedBox(height: 13),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 9,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: interviewing
                          ? const Color(0xFFFFF7ED)
                          : AppColors.successSurface,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 3,
                          backgroundColor: interviewing
                              ? const Color(0xFFB45309)
                              : AppColors.success,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          statusLabel,
                          style: TextStyle(
                            color: interviewing
                                ? const Color(0xFFB45309)
                                : AppColors.success,
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Spacer(),
                  const Icon(
                    Icons.groups_outlined,
                    size: 17,
                    color: AppColors.onSurfaceVariant,
                  ),
                  const SizedBox(width: 5),
                  Text(
                    candidateLabel,
                    style: const TextStyle(
                      color: AppColors.onSurfaceVariant,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(width: 4),
                  const Icon(
                    Icons.chevron_right_rounded,
                    size: 18,
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

  String _localizeLocation(String location) {
    return location
        .replaceAll('Hybrid', 'Hibrit')
        .replaceAll('On-site', 'Ofisten')
        .replaceAll('Remote', 'Uzaktan');
  }
}

class _EmptyJobs extends StatelessWidget {
  const _EmptyJobs();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.search_off_rounded,
              size: 44,
              color: AppColors.outline,
            ),
            const SizedBox(height: 12),
            const Text(
              'İlan bulunamadı',
              style: TextStyle(
                color: AppColors.onSurface,
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 5),
            TextButton(
              onPressed: () =>
                  Navigator.of(context).pushNamed(NewRequisitionPage.routeName),
              child: const Text('Yeni ilan oluştur'),
            ),
          ],
        ),
      ),
    );
  }
}
