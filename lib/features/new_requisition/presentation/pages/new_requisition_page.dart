import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/requisition.dart';
import '../controllers/new_requisition_controller.dart';

class NewRequisitionPage extends StatefulWidget {
  const NewRequisitionPage({super.key, required this.controller});

  static const routeName = '/new-requisition';

  final NewRequisitionController controller;

  @override
  State<NewRequisitionPage> createState() => _NewRequisitionPageState();
}

class _NewRequisitionPageState extends State<NewRequisitionPage> {
  late final TextEditingController _titleController;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.controller.jobTitle);
  }

  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: widget.controller,
      builder: (context, _) {
        final controller = widget.controller;
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
            titleSpacing: 0,
            title: const Text(
              'New Requisition',
              style: TextStyle(
                color: AppColors.primary,
                fontSize: 20,
                fontWeight: FontWeight.w600,
              ),
            ),
            actions: [
              IconButton(
                tooltip: 'Cancel',
                onPressed: () => Navigator.of(context).maybePop(),
                icon: const Icon(Icons.close_rounded),
              ),
              const SizedBox(width: 8),
            ],
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 120),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 680),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const _WizardProgress(),
                    const SizedBox(height: 24),
                    _FieldLabel(label: 'Job Title'),
                    const SizedBox(height: 4),
                    TextField(
                      key: const ValueKey('requisitionTitleField'),
                      controller: _titleController,
                      onChanged: controller.updateJobTitle,
                      textCapitalization: TextCapitalization.words,
                      decoration: _inputDecoration(
                        hintText: 'e.g. Senior Backend Engineer',
                        errorText:
                            controller.validationMessage?.startsWith('Enter') ==
                                true
                            ? controller.validationMessage
                            : null,
                      ),
                    ),
                    const SizedBox(height: 24),
                    _FieldLabel(label: 'Department'),
                    const SizedBox(height: 4),
                    DropdownButtonFormField<String>(
                      key: const ValueKey('requisitionDepartmentField'),
                      initialValue: controller.department,
                      isExpanded: true,
                      decoration: _inputDecoration(
                        hintText: 'Select department',
                        errorText:
                            controller.validationMessage?.startsWith(
                                  'Select a department',
                                ) ==
                                true
                            ? controller.validationMessage
                            : null,
                      ),
                      items: controller.catalog.departments
                          .map(
                            (department) => DropdownMenuItem(
                              value: department,
                              child: Text(department),
                            ),
                          )
                          .toList(growable: false),
                      onChanged: controller.selectDepartment,
                    ),
                    const SizedBox(height: 24),
                    _FieldLabel(label: 'Location Type'),
                    const SizedBox(height: 8),
                    ...WorkLocationType.values.map(
                      (type) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: _LocationTypeCard(
                          key: ValueKey('locationType-${type.name}'),
                          type: type,
                          selected: controller.locationType == type,
                          onTap: () => controller.selectLocationType(type),
                        ),
                      ),
                    ),
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 180),
                      child: controller.requiresOffice
                          ? Padding(
                              key: const ValueKey('officeLocationSection'),
                              padding: const EdgeInsets.only(top: 16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  _FieldLabel(label: 'Office Location'),
                                  const SizedBox(height: 4),
                                  DropdownButtonFormField<String>(
                                    key: const ValueKey(
                                      'requisitionOfficeField',
                                    ),
                                    initialValue: controller.office,
                                    isExpanded: true,
                                    decoration: _inputDecoration(
                                      hintText: 'Select office',
                                      errorText:
                                          controller.validationMessage
                                                  ?.startsWith(
                                                    'Select an office',
                                                  ) ==
                                              true
                                          ? controller.validationMessage
                                          : null,
                                    ),
                                    items: controller.catalog.offices
                                        .map(
                                          (office) => DropdownMenuItem(
                                            value: office,
                                            child: Text(office),
                                          ),
                                        )
                                        .toList(growable: false),
                                    onChanged: controller.selectOffice,
                                  ),
                                ],
                              ),
                            )
                          : const SizedBox.shrink(
                              key: ValueKey('noOfficeLocation'),
                            ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          floatingActionButton: FloatingActionButton(
            key: const ValueKey('requisitionAiButton'),
            tooltip: 'Open AI Assistant',
            onPressed: () => _showAiAssistant(context),
            backgroundColor: const Color(0xFFE1E0FF),
            foregroundColor: AppColors.tertiary,
            child: const Icon(Icons.auto_awesome_rounded),
          ),
          bottomNavigationBar: _BottomActions(
            onCancel: () => Navigator.of(context).maybePop(),
            onContinue: () => _continue(context),
          ),
        );
      },
    );
  }

  void _continue(BuildContext context) {
    FocusScope.of(context).unfocus();
    final saved = widget.controller.continueToNextStep();
    if (!saved) return;
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        const SnackBar(
          content: Text('Role definition saved. Step 2 is ready.'),
        ),
      );
  }

  Future<void> _showAiAssistant(BuildContext context) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      showDragHandle: true,
      backgroundColor: Colors.white,
      constraints: const BoxConstraints(maxWidth: 720),
      builder: (sheetContext) => AnimatedBuilder(
        animation: widget.controller,
        builder: (context, _) {
          final controller = widget.controller;
          final catalog = controller.catalog;
          final role = controller.jobTitle.trim().isEmpty
              ? 'Senior Backend Engineer'
              : controller.jobTitle.trim();
          return FractionallySizedBox(
            heightFactor: .8,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 8, 12),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.auto_awesome_rounded,
                        color: AppColors.tertiary,
                      ),
                      const SizedBox(width: 8),
                      const Expanded(
                        child: Text(
                          'AI Requisition Assistant',
                          style: TextStyle(
                            color: AppColors.tertiary,
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      IconButton(
                        tooltip: 'Close assistant',
                        onPressed: () => Navigator.of(sheetContext).pop(),
                        icon: const Icon(Icons.close_rounded),
                      ),
                    ],
                  ),
                ),
                const Divider(height: 1),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          'Based on "$role", here are some intelligent suggestions to build your role faster.',
                          style: const TextStyle(
                            color: AppColors.onSurfaceVariant,
                            fontSize: 14,
                            height: 1.45,
                          ),
                        ),
                        const SizedBox(height: 24),
                        const _FieldLabel(label: 'SUGGESTED CORE SKILLS'),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: catalog.suggestedSkills
                              .map((skill) {
                                final selected = controller.selectedSkills
                                    .contains(skill);
                                return FilterChip(
                                  key: ValueKey('suggestedSkill-$skill'),
                                  selected: selected,
                                  avatar: Icon(
                                    selected
                                        ? Icons.check_rounded
                                        : Icons.add_rounded,
                                    size: 16,
                                  ),
                                  label: Text(skill),
                                  onSelected: (_) =>
                                      controller.toggleSkill(skill),
                                );
                              })
                              .toList(growable: false),
                        ),
                        const SizedBox(height: 24),
                        Row(
                          children: [
                            const Expanded(
                              child: _FieldLabel(label: 'MARKET COMPENSATION'),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.surfaceContainer,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                catalog.marketLabel,
                                style: const TextStyle(
                                  color: AppColors.onSurfaceVariant,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        _CompensationCard(
                          catalog: catalog,
                          applied: controller.useMarketCompensation,
                          onApply: controller.applyMarketCompensation,
                        ),
                        const SizedBox(height: 24),
                        FilledButton(
                          key: const ValueKey('autoDraftDescriptionButton'),
                          onPressed: controller.autoDraftDescription,
                          style: FilledButton.styleFrom(
                            backgroundColor: AppColors.tertiary,
                            foregroundColor: Colors.white,
                          ),
                          child: Text(
                            controller.descriptionDrafted
                                ? 'Job Description Drafted'
                                : 'Auto-Draft Job Description',
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

InputDecoration _inputDecoration({String? hintText, String? errorText}) {
  return InputDecoration(
    hintText: hintText,
    errorText: errorText,
    filled: true,
    fillColor: Colors.white,
    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(4),
      borderSide: const BorderSide(color: AppColors.outlineVariant),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(4),
      borderSide: const BorderSide(color: AppColors.primary, width: 2),
    ),
    errorBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(4),
      borderSide: const BorderSide(color: Color(0xFFBA1A1A)),
    ),
  );
}

class _WizardProgress extends StatelessWidget {
  const _WizardProgress();

  @override
  Widget build(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          'STEP 1 OF 4',
          style: TextStyle(
            color: AppColors.onSurfaceVariant,
            fontSize: 11,
            fontWeight: FontWeight.w500,
            letterSpacing: 1,
          ),
        ),
        SizedBox(height: 4),
        Text(
          'Role Definition',
          style: TextStyle(
            color: AppColors.onSurface,
            fontSize: 18,
            fontWeight: FontWeight.w500,
          ),
        ),
        SizedBox(height: 8),
        Row(
          children: [
            Expanded(child: _ProgressSegment(active: true)),
            SizedBox(width: 4),
            Expanded(child: _ProgressSegment()),
            SizedBox(width: 4),
            Expanded(child: _ProgressSegment()),
            SizedBox(width: 4),
            Expanded(child: _ProgressSegment()),
          ],
        ),
      ],
    );
  }
}

class _ProgressSegment extends StatelessWidget {
  const _ProgressSegment({this.active = false});

  final bool active;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        color: active ? AppColors.primary : AppColors.surfaceHighest,
        borderRadius: BorderRadius.circular(999),
      ),
      child: const SizedBox(height: 4),
    );
  }
}

class _FieldLabel extends StatelessWidget {
  const _FieldLabel({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Text(
      label,
      style: const TextStyle(
        color: AppColors.onSurface,
        fontSize: 12,
        fontWeight: FontWeight.w600,
        letterSpacing: .4,
      ),
    );
  }
}

class _LocationTypeCard extends StatelessWidget {
  const _LocationTypeCard({
    super.key,
    required this.type,
    required this.selected,
    required this.onTap,
  });

  final WorkLocationType type;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? AppColors.surfaceLow : Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(4),
        side: BorderSide(
          color: selected ? AppColors.primary : AppColors.outlineVariant,
          width: selected ? 2 : 1,
        ),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(4),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              Icon(
                selected
                    ? Icons.radio_button_checked_rounded
                    : Icons.radio_button_off_rounded,
                color: selected
                    ? AppColors.primary
                    : AppColors.onSurfaceVariant,
                size: 20,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      type.label,
                      style: const TextStyle(
                        color: AppColors.onSurface,
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Text(
                      type.description,
                      style: const TextStyle(
                        color: AppColors.onSurfaceVariant,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CompensationCard extends StatelessWidget {
  const _CompensationCard({
    required this.catalog,
    required this.applied,
    required this.onApply,
  });

  final RequisitionCatalog catalog;
  final bool applied;
  final VoidCallback onApply;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surfaceLow,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Text(
                  catalog.marketRange,
                  style: const TextStyle(
                    color: AppColors.primary,
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const Text(
                'Base Salary',
                style: TextStyle(
                  color: AppColors.onSurfaceVariant,
                  fontSize: 14,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Stack(
            children: [
              Container(
                height: 8,
                decoration: BoxDecoration(
                  color: AppColors.surfaceHigh,
                  borderRadius: BorderRadius.circular(999),
                ),
              ),
              FractionallySizedBox(
                widthFactor: .75,
                child: Container(
                  margin: const EdgeInsets.only(left: 36),
                  height: 8,
                  decoration: BoxDecoration(
                    color: const Color(0xFFC0C1FF),
                    borderRadius: BorderRadius.circular(999),
                  ),
                ),
              ),
              Positioned(
                left: 0,
                right: 0,
                child: Center(
                  child: Container(
                    width: 3,
                    height: 8,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(catalog.percentile25, style: _percentileStyle),
              Text(catalog.median, style: _percentileStyle),
              Text(catalog.percentile75, style: _percentileStyle),
            ],
          ),
          const SizedBox(height: 16),
          OutlinedButton.icon(
            key: const ValueKey('applyCompRangeButton'),
            onPressed: applied ? null : onApply,
            icon: Icon(applied ? Icons.check_rounded : Icons.add_rounded),
            label: Text(
              applied ? 'Comp Range Applied' : 'Apply Comp Range to Req',
            ),
          ),
        ],
      ),
    );
  }
}

const _percentileStyle = TextStyle(
  color: AppColors.onSurfaceVariant,
  fontSize: 10,
  fontWeight: FontWeight.w500,
);

class _BottomActions extends StatelessWidget {
  const _BottomActions({required this.onCancel, required this.onContinue});

  final VoidCallback onCancel;
  final VoidCallback onContinue;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.outlineVariant)),
        boxShadow: [
          BoxShadow(
            color: Color(0x0D000000),
            offset: Offset(0, -4),
            blurRadius: 6,
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              TextButton(onPressed: onCancel, child: const Text('Cancel')),
              const Spacer(),
              FilledButton.icon(
                key: const ValueKey('requisitionContinueButton'),
                onPressed: onContinue,
                iconAlignment: IconAlignment.end,
                icon: const Icon(Icons.arrow_forward_rounded, size: 18),
                label: const Text('Continue'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
