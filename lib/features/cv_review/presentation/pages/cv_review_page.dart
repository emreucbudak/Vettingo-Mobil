import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/candidate_cv_review.dart';
import '../controllers/cv_review_controller.dart';

class CvReviewPage extends StatelessWidget {
  const CvReviewPage({super.key, required this.controller});

  static const routeName = '/cv-review';

  final CvReviewController controller;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        final review = controller.review;
        return Scaffold(
          appBar: AppBar(
            toolbarHeight: 64,
            shape: const Border(
              bottom: BorderSide(color: AppColors.outlineVariant),
            ),
            leading: IconButton(
              tooltip: 'Close review',
              onPressed: () => Navigator.of(context).maybePop(),
              icon: const Icon(Icons.close_rounded),
            ),
            titleSpacing: 0,
            title: const Text(
              'Review Parsed Data',
              style: TextStyle(
                color: AppColors.primary,
                fontSize: 18,
                fontWeight: FontWeight.w500,
              ),
            ),
            actions: const [
              Center(
                child: Text(
                  'Step 2 of 3',
                  style: TextStyle(
                    color: AppColors.onSurfaceVariant,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              SizedBox(width: 16),
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
                    ClipRRect(
                      borderRadius: BorderRadius.circular(999),
                      child: const LinearProgressIndicator(
                        value: 2 / 3,
                        minHeight: 6,
                        backgroundColor: AppColors.surfaceContainer,
                        valueColor: AlwaysStoppedAnimation(AppColors.primary),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Verify Candidate Info',
                      style: TextStyle(
                        color: AppColors.primary,
                        fontSize: 20,
                        height: 1.4,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Please review the information extracted from the CV. Tap any section to edit.',
                      style: TextStyle(
                        color: AppColors.onSurfaceVariant,
                        fontSize: 14,
                        height: 1.45,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _ReviewCard(
                      title: 'Summary',
                      onEdit: () => _editSummary(context),
                      child: Text(
                        review.summary,
                        style: const TextStyle(
                          color: AppColors.onSurfaceVariant,
                          fontSize: 14,
                          height: 1.55,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    _ReviewCard(
                      title: 'Core Skills',
                      onEdit: () => _manageSkills(context),
                      child: Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          ...review.coreSkills.map(
                            (skill) => Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.surfaceHigh,
                                borderRadius: BorderRadius.circular(4),
                                border: Border.all(
                                  color: AppColors.outlineVariant,
                                ),
                              ),
                              child: Text(
                                skill,
                                style: const TextStyle(
                                  color: AppColors.primary,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                          ActionChip(
                            key: const ValueKey('addCvSkillButton'),
                            avatar: const Icon(Icons.add_rounded, size: 16),
                            label: const Text('Add Skill'),
                            onPressed: () => _addSkill(context),
                            side: const BorderSide(
                              color: AppColors.outlineVariant,
                              style: BorderStyle.solid,
                            ),
                            backgroundColor: AppColors.surface,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    _ReviewCard(
                      title: 'Experience',
                      child: _ExperienceTimeline(
                        experiences: review.experiences,
                        onEdit: (index) => _editExperience(context, index),
                      ),
                    ),
                    const SizedBox(height: 16),
                    _ReviewCard(
                      title: 'Education',
                      onEdit: () => _editEducation(context),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            review.education.degree,
                            style: const TextStyle(
                              color: AppColors.primary,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  review.education.institution,
                                  style: const TextStyle(
                                    color: AppColors.onSurfaceVariant,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                              Text(
                                review.education.period,
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
                    if (controller.completed) ...[
                      const SizedBox(height: 16),
                      const _StatusBanner(
                        icon: Icons.check_circle_outline_rounded,
                        message: 'Candidate profile is ready.',
                        color: AppColors.success,
                      ),
                    ] else if (controller.reuploadRequested) ...[
                      const SizedBox(height: 16),
                      const _StatusBanner(
                        icon: Icons.upload_file_rounded,
                        message: 'CV re-upload flow requested.',
                        color: AppColors.primary,
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
          bottomNavigationBar: _ReviewActions(
            completed: controller.completed,
            onReupload: () {
              controller.requestReupload();
              _showMessage(context, 'CV re-upload flow is ready.');
            },
            onContinue: () {
              controller.completeReview();
              _showMessage(context, 'Candidate profile saved.');
            },
          ),
        );
      },
    );
  }

  Future<void> _editSummary(BuildContext context) async {
    final value = await _showTextEditor(
      context,
      title: 'Edit Summary',
      initialValue: controller.review.summary,
      maxLines: 8,
    );
    if (value != null) controller.updateSummary(value);
  }

  Future<void> _addSkill(BuildContext context) async {
    final value = await _showTextEditor(
      context,
      title: 'Add Core Skill',
      hintText: 'e.g. Flutter',
    );
    if (value != null) controller.addSkill(value);
  }

  Future<void> _manageSkills(BuildContext context) {
    return showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      backgroundColor: AppColors.surface,
      builder: (sheetContext) => AnimatedBuilder(
        animation: controller,
        builder: (context, _) => SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Manage Core Skills',
                  style: TextStyle(
                    color: AppColors.primary,
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: controller.review.coreSkills
                      .map(
                        (skill) => InputChip(
                          label: Text(skill),
                          onDeleted: () => controller.removeSkill(skill),
                        ),
                      )
                      .toList(growable: false),
                ),
                const SizedBox(height: 16),
                OutlinedButton.icon(
                  onPressed: () {
                    Navigator.of(sheetContext).pop();
                    _addSkill(context);
                  },
                  icon: const Icon(Icons.add_rounded),
                  label: const Text('Add another skill'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _editExperience(BuildContext context, int index) async {
    final current = controller.review.experiences[index];
    final result = await _showExperienceEditor(context, current);
    if (result != null) controller.updateExperience(index, result);
  }

  Future<void> _editEducation(BuildContext context) async {
    final result = await _showEducationEditor(
      context,
      controller.review.education,
    );
    if (result != null) controller.updateEducation(result);
  }

  void _showMessage(BuildContext context, String message) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));
  }
}

class _ReviewCard extends StatelessWidget {
  const _ReviewCard({required this.title, required this.child, this.onEdit});

  final String title;
  final Widget child;
  final VoidCallback? onEdit;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: AppColors.outlineVariant),
        boxShadow: const [
          BoxShadow(
            color: Color(0x09000000),
            blurRadius: 4,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
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
              if (onEdit != null)
                IconButton(
                  tooltip: 'Edit $title',
                  visualDensity: VisualDensity.compact,
                  onPressed: onEdit,
                  icon: const Icon(
                    Icons.edit_outlined,
                    color: AppColors.primary,
                    size: 20,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8),
          child,
        ],
      ),
    );
  }
}

class _ExperienceTimeline extends StatelessWidget {
  const _ExperienceTimeline({required this.experiences, required this.onEdit});

  final List<CvExperience> experiences;
  final ValueChanged<int> onEdit;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(experiences.length, (index) {
        final experience = experiences[index];
        return IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              SizedBox(
                width: 20,
                child: Column(
                  children: [
                    Container(
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: index == 0
                            ? AppColors.primary
                            : AppColors.surfaceHigh,
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.outlineVariant),
                      ),
                    ),
                    if (index < experiences.length - 1)
                      const Expanded(
                        child: VerticalDivider(
                          color: AppColors.outlineVariant,
                          width: 1,
                          thickness: 1,
                        ),
                      ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Padding(
                  padding: EdgeInsets.only(
                    bottom: index < experiences.length - 1 ? 16 : 0,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Text(
                              experience.role,
                              style: const TextStyle(
                                color: AppColors.primary,
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          Text(
                            experience.period,
                            style: const TextStyle(
                              color: AppColors.onSurfaceVariant,
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          InkWell(
                            key: ValueKey('editCvExperience$index'),
                            onTap: () => onEdit(index),
                            child: const Padding(
                              padding: EdgeInsets.only(left: 8),
                              child: Icon(Icons.edit_outlined, size: 16),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        experience.company,
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
                          fontSize: 13,
                          height: 1.35,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      }),
    );
  }
}

class _ReviewActions extends StatelessWidget {
  const _ReviewActions({
    required this.completed,
    required this.onReupload,
    required this.onContinue,
  });

  final bool completed;
  final VoidCallback onReupload;
  final VoidCallback onContinue;

  @override
  Widget build(BuildContext context) {
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
                child: OutlinedButton(
                  key: const ValueKey('reuploadCvButton'),
                  onPressed: onReupload,
                  child: const Text('Re-upload CV'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: FilledButton(
                  key: const ValueKey('continueToProfileButton'),
                  onPressed: completed ? null : onContinue,
                  child: Text(
                    completed ? 'Profile Ready' : 'Continue to Profile',
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

class _StatusBanner extends StatelessWidget {
  const _StatusBanner({
    required this.icon,
    required this.message,
    required this.color,
  });

  final IconData icon;
  final String message;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withValues(alpha: .1),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        children: [
          Icon(icon, color: color),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              message,
              style: TextStyle(color: color, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }
}

Future<String?> _showTextEditor(
  BuildContext context, {
  required String title,
  String initialValue = '',
  String? hintText,
  int maxLines = 1,
}) async {
  final textController = TextEditingController(text: initialValue);
  final result = await showDialog<String>(
    context: context,
    builder: (dialogContext) => AlertDialog(
      title: Text(title),
      content: TextField(
        key: const ValueKey('cvTextEditor'),
        controller: textController,
        autofocus: true,
        maxLines: maxLines,
        decoration: InputDecoration(hintText: hintText),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(dialogContext).pop(),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: () => Navigator.of(dialogContext).pop(textController.text),
          child: const Text('Save'),
        ),
      ],
    ),
  );
  await Future<void>.delayed(const Duration(milliseconds: 250));
  textController.dispose();
  return result;
}

Future<CvExperience?> _showExperienceEditor(
  BuildContext context,
  CvExperience experience,
) async {
  final role = TextEditingController(text: experience.role);
  final company = TextEditingController(text: experience.company);
  final period = TextEditingController(text: experience.period);
  final description = TextEditingController(text: experience.description);
  final result = await showDialog<CvExperience>(
    context: context,
    builder: (dialogContext) => AlertDialog(
      title: const Text('Edit Experience'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: role,
              decoration: const InputDecoration(labelText: 'Role'),
            ),
            TextField(
              controller: company,
              decoration: const InputDecoration(labelText: 'Company'),
            ),
            TextField(
              controller: period,
              decoration: const InputDecoration(labelText: 'Period'),
            ),
            TextField(
              controller: description,
              maxLines: 4,
              decoration: const InputDecoration(labelText: 'Description'),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(dialogContext).pop(),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: () => Navigator.of(dialogContext).pop(
            experience.copyWith(
              role: role.text.trim(),
              company: company.text.trim(),
              period: period.text.trim(),
              description: description.text.trim(),
            ),
          ),
          child: const Text('Save'),
        ),
      ],
    ),
  );
  await Future<void>.delayed(const Duration(milliseconds: 250));
  role.dispose();
  company.dispose();
  period.dispose();
  description.dispose();
  return result;
}

Future<CvEducation?> _showEducationEditor(
  BuildContext context,
  CvEducation education,
) async {
  final degree = TextEditingController(text: education.degree);
  final institution = TextEditingController(text: education.institution);
  final period = TextEditingController(text: education.period);
  final result = await showDialog<CvEducation>(
    context: context,
    builder: (dialogContext) => AlertDialog(
      title: const Text('Edit Education'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: degree,
            decoration: const InputDecoration(labelText: 'Degree'),
          ),
          TextField(
            controller: institution,
            decoration: const InputDecoration(labelText: 'Institution'),
          ),
          TextField(
            controller: period,
            decoration: const InputDecoration(labelText: 'Period'),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(dialogContext).pop(),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: () => Navigator.of(dialogContext).pop(
            education.copyWith(
              degree: degree.text.trim(),
              institution: institution.text.trim(),
              period: period.text.trim(),
            ),
          ),
          child: const Text('Save'),
        ),
      ],
    ),
  );
  await Future<void>.delayed(const Duration(milliseconds: 250));
  degree.dispose();
  institution.dispose();
  period.dispose();
  return result;
}
