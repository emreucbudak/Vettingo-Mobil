import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/coming_soon_snackbar.dart';
import '../../../candidate/presentation/widgets/candidate_shell.dart';
import '../../domain/entities/candidate_dashboard.dart';
import '../controllers/candidate_dashboard_controller.dart';

enum _ApplicationFilter { ongoing, rejected }

class CandidateApplicationsPage extends StatefulWidget {
  const CandidateApplicationsPage({super.key, required this.controller});

  static const routeName = '/candidate-applications';

  final CandidateDashboardController controller;

  @override
  State<CandidateApplicationsPage> createState() =>
      _CandidateApplicationsPageState();
}

class _CandidateApplicationsPageState extends State<CandidateApplicationsPage> {
  _ApplicationFilter _selectedFilter = _ApplicationFilter.ongoing;

  @override
  Widget build(BuildContext context) {
    final applications = widget.controller.dashboard.applicationHistory
        .where(_matchesSelectedFilter)
        .toList(growable: false);

    return CandidateScaffold(
      selectedItem: CandidateNavigationItem.jobs,
      body: ListView(
        key: const ValueKey('candidateApplicationsPage'),
        padding: const EdgeInsets.fromLTRB(16, 24, 16, 32),
        children: [
          Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 680),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    'Başvurularım',
                    style: TextStyle(
                      color: AppColors.onSurface,
                      fontSize: 24,
                      height: 1.3,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Başvurduğun ilanların güncel durumunu takip et.',
                    style: TextStyle(
                      color: AppColors.onSurfaceVariant,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _ApplicationFilterChip(
                        key: const ValueKey('applicationFilterOngoing'),
                        label: 'Devam Eden',
                        selected: _selectedFilter == _ApplicationFilter.ongoing,
                        onTap: () => _selectFilter(_ApplicationFilter.ongoing),
                      ),
                      _ApplicationFilterChip(
                        key: const ValueKey('applicationFilterRejected'),
                        label: 'Reddedildi',
                        selected:
                            _selectedFilter == _ApplicationFilter.rejected,
                        onTap: () => _selectFilter(_ApplicationFilter.rejected),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Text(
                    '${applications.length} başvuru',
                    style: const TextStyle(
                      color: AppColors.onSurfaceVariant,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ...applications.map(
                    (application) => Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: _ApplicationCard(
                        application: application,
                        onTap: () => showComingSoonSnackbar(
                          context,
                          '${application.role} başvuru detayı',
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  bool _matchesSelectedFilter(JobApplication application) {
    final rejected = application.status.toLowerCase() == 'rejected';
    return _selectedFilter == _ApplicationFilter.rejected
        ? rejected
        : !rejected;
  }

  void _selectFilter(_ApplicationFilter filter) {
    if (_selectedFilter == filter) return;
    setState(() => _selectedFilter = filter);
  }
}

class _ApplicationFilterChip extends StatelessWidget {
  const _ApplicationFilterChip({
    super.key,
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? AppColors.primary : Colors.white,
      shape: StadiumBorder(
        side: BorderSide(
          color: selected ? AppColors.primary : AppColors.outlineVariant,
        ),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(999),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text(
            label,
            style: TextStyle(
              color: selected ? Colors.white : AppColors.onSurfaceVariant,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}

class _ApplicationCard extends StatelessWidget {
  const _ApplicationCard({required this.application, required this.onTap});

  final JobApplication application;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final rejected = application.status.toLowerCase() == 'rejected';
    final statusColor = rejected ? const Color(0xFFBA1A1A) : AppColors.success;
    final statusSurface = rejected
        ? const Color(0xFFFFE5E5)
        : AppColors.successSurface;

    return Material(
      key: ValueKey('candidateApplication-${application.role}'),
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
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          application.role,
                          style: const TextStyle(
                            color: AppColors.primary,
                            fontSize: 17,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${application.company}  •  ${application.location}',
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
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: statusSurface,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      rejected ? 'Reddedildi' : 'Sürüyor',
                      style: TextStyle(
                        color: statusColor,
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              Text(
                application.stageLabel,
                style: const TextStyle(
                  color: AppColors.onSurface,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                application.nextStep,
                style: const TextStyle(
                  color: AppColors.onSurfaceVariant,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
