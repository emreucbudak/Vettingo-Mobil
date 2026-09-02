import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/talent_pulse_shell.dart';
import '../../../dashboard/domain/entities/employer_dashboard.dart';
import '../../../dashboard/presentation/controllers/employer_dashboard_controller.dart';
import '../../../new_requisition/presentation/pages/new_requisition_page.dart';
import 'employer_candidates_page.dart';

class EmployerJobsPage extends StatefulWidget {
  const EmployerJobsPage({super.key, required this.controller});

  static const routeName = '/employer-jobs';

  final EmployerDashboardController controller;

  @override
  State<EmployerJobsPage> createState() => _EmployerJobsPageState();
}

class _EmployerJobsPageState extends State<EmployerJobsPage> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final jobs = _visibleJobs(widget.controller.dashboard.requisitions);

    return Scaffold(
      appBar: const TalentPulseTopBar(
        showAvatar: false,
        showNotifications: false,
        title: 'Vettingo',
      ),
      body: CustomScrollView(
        key: const ValueKey('employerJobsPage'),
        slivers: [
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 20, 16, 8),
            sliver: SliverToBoxAdapter(
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 720),
                  child: TextField(
                    key: const ValueKey('employerJobSearchField'),
                    controller: _searchController,
                    onChanged: (_) => setState(() {}),
                    textInputAction: TextInputAction.search,
                    decoration: InputDecoration(
                      hintText: 'İlan ara',
                      prefixIcon: const Icon(Icons.search_rounded),
                      suffixIcon: _searchController.text.isEmpty
                          ? null
                          : IconButton(
                              key: const ValueKey('employerJobSearchClear'),
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
                    child: _EmployerJobCard(
                      key: ValueKey('employerJobCard$index'),
                      job: jobs[index],
                      onTap: () =>
                          Navigator.of(context).pushNamed('/talent-comparison'),
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
      floatingActionButton: FloatingActionButton.extended(
        key: const ValueKey('employerNewJobButton'),
        onPressed: () =>
            Navigator.of(context).pushNamed(NewRequisitionPage.routeName),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        icon: const Icon(Icons.add_rounded),
        label: const Text(
          'Yeni İlan',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
      bottomNavigationBar: TalentPulseBottomBar(
        selectedIndex: 1,
        onSelected: (index) => _openDestination(context, index),
      ),
    );
  }

  List<JobRequisition> _visibleJobs(List<JobRequisition> jobs) {
    final query = _searchController.text.trim().toLowerCase();
    if (query.isEmpty) return jobs;

    return jobs
        .where(
          (job) =>
              job.role.toLowerCase().contains(query) ||
              job.location.toLowerCase().contains(query),
        )
        .toList(growable: false);
  }

  void _openDestination(BuildContext context, int index) {
    if (index == 1) return;
    if (index == 0) {
      Navigator.of(context).pushReplacementNamed('/employer-dashboard');
      return;
    }
    if (index == 3) {
      Navigator.of(context).pushReplacementNamed('/employer-profile');
      return;
    }

    Navigator.of(
      context,
    ).pushReplacementNamed(EmployerCandidatesPage.routeName);
  }
}

class _EmployerJobCard extends StatelessWidget {
  const _EmployerJobCard({super.key, required this.job, required this.onTap});

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
                  const Icon(
                    Icons.chevron_right_rounded,
                    color: AppColors.onSurfaceVariant,
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
    return const Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.search_off_rounded, size: 44, color: AppColors.outline),
            SizedBox(height: 12),
            Text(
              'İlan bulunamadı',
              style: TextStyle(
                color: AppColors.onSurface,
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
