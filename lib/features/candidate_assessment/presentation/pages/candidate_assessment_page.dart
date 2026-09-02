import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../candidate/presentation/widgets/candidate_shell.dart';
import '../../domain/entities/candidate_assessment.dart';
import '../controllers/candidate_assessment_controller.dart';

class CandidateAssessmentPage extends StatelessWidget {
  const CandidateAssessmentPage({super.key, required this.controller});

  static const routeName = '/candidate-assessment';

  final CandidateAssessmentController controller;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        final question = controller.currentQuestion;
        return CandidateScaffold(
          body: Column(
            children: [
              _AssessmentStatusBar(
                timeLabel: controller.assessment.remainingTimeLabel,
                onClose: () => Navigator.of(context).maybePop(),
                onFinish: () => _confirmFinish(context),
              ),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(16, 24, 16, 32),
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 720),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          _QuestionHeader(
                            category: question.category,
                            index: controller.currentIndex,
                            total: controller.assessment.questions.length,
                            difficulty: question.difficulty,
                          ),
                          const SizedBox(height: 24),
                          Text(
                            question.prompt,
                            style: const TextStyle(
                              color: AppColors.onSurface,
                              fontSize: 16,
                              height: 1.5,
                            ),
                          ),
                          const SizedBox(height: 16),
                          _CodeBlock(question: question),
                          const SizedBox(height: 24),
                          const Text(
                            'SELECT ONE OPTION',
                            style: TextStyle(
                              color: AppColors.onSurfaceVariant,
                              fontSize: 12,
                              height: 1.35,
                              fontWeight: FontWeight.w600,
                              letterSpacing: .6,
                            ),
                          ),
                          const SizedBox(height: 8),
                          ...question.options.indexed.map((entry) {
                            final option = entry.$2;
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 8),
                              child: _AnswerOption(
                                key: ValueKey('assessmentOption${entry.$1}'),
                                option: option,
                                selected: controller.currentAnswer == option.id,
                                enabled: !controller.isFinished,
                                onSelected: () =>
                                    controller.selectAnswer(option.id),
                              ),
                            );
                          }),
                          if (controller.isFinished) ...[
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: AppColors.successSurface,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Row(
                                children: [
                                  Icon(
                                    Icons.check_circle_outline_rounded,
                                    color: AppColors.success,
                                  ),
                                  SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      'Assessment submitted successfully.',
                                      style: TextStyle(
                                        color: AppColors.onSurface,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
          bottomActions: _AssessmentNavigation(
            canGoPrevious: controller.canGoPrevious,
            canGoNext: controller.canGoNext,
            isFinished: controller.isFinished,
            onPrevious: controller.previous,
            onGrid: () => _showQuestionGrid(context),
            onNext: controller.next,
            onFinish: () => _confirmFinish(context),
          ),
        );
      },
    );
  }

  Future<void> _confirmFinish(BuildContext context) async {
    if (controller.isFinished) return;
    final shouldFinish = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Finish assessment?'),
        content: Text(
          '${controller.answeredCount} of ${controller.assessment.questions.length} questions are answered. You will not be able to change your answers after submitting.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: const Text('Keep working'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(dialogContext).pop(true),
            child: const Text('Submit'),
          ),
        ],
      ),
    );
    if (shouldFinish != true || !context.mounted) return;
    controller.finish();
  }

  Future<void> _showQuestionGrid(BuildContext context) {
    return showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      builder: (sheetContext) => AnimatedBuilder(
        animation: controller,
        builder: (context, _) => SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    const Expanded(
                      child: Text(
                        'Question Navigation',
                        style: TextStyle(
                          color: AppColors.onSurface,
                          fontSize: 18,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    IconButton(
                      tooltip: 'Close question navigation',
                      onPressed: () => Navigator.of(sheetContext).pop(),
                      icon: const Icon(Icons.close_rounded),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                GridView.builder(
                  key: const ValueKey('assessmentQuestionGrid'),
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 5,
                    mainAxisSpacing: 8,
                    crossAxisSpacing: 8,
                  ),
                  itemCount: controller.assessment.questions.length,
                  itemBuilder: (context, index) {
                    final selected = index == controller.currentIndex;
                    final answered = controller.isAnswered(index);
                    return Material(
                      color: selected
                          ? AppColors.primary
                          : answered
                          ? AppColors.surfaceHighest
                          : Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(6),
                        side: const BorderSide(color: AppColors.outlineVariant),
                      ),
                      child: InkWell(
                        key: ValueKey('assessmentQuestion${index + 1}'),
                        borderRadius: BorderRadius.circular(6),
                        onTap: () {
                          controller.selectQuestion(index);
                          Navigator.of(sheetContext).pop();
                        },
                        child: Center(
                          child: Text(
                            '${index + 1}',
                            style: TextStyle(
                              color: selected
                                  ? Colors.white
                                  : AppColors.onSurface,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 20),
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _LegendDot(
                      color: AppColors.surfaceHighest,
                      label: 'Answered',
                    ),
                    _LegendDot(color: AppColors.primary, label: 'Current'),
                    _LegendDot(color: Colors.white, label: 'Unanswered'),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _AssessmentStatusBar extends StatelessWidget {
  const _AssessmentStatusBar({
    required this.timeLabel,
    required this.onClose,
    required this.onFinish,
  });

  final String timeLabel;
  final VoidCallback onClose;
  final VoidCallback onFinish;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56,
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.outlineVariant)),
      ),
      child: Row(
        children: [
          IconButton(
            tooltip: 'Close assessment',
            onPressed: onClose,
            icon: const Icon(Icons.close_rounded),
          ),
          const Expanded(
            child: Text(
              'Assessment',
              style: TextStyle(
                color: AppColors.primary,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFFFFDAD6),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.timer_outlined,
                  color: Color(0xFFBA1A1A),
                  size: 20,
                ),
                const SizedBox(width: 4),
                Text(
                  timeLabel,
                  style: const TextStyle(
                    color: Color(0xFFBA1A1A),
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          TextButton(
            onPressed: onFinish,
            child: const Text(
              'FINISH',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
            ),
          ),
          const SizedBox(width: 4),
        ],
      ),
    );
  }
}

class _QuestionHeader extends StatelessWidget {
  const _QuestionHeader({
    required this.category,
    required this.index,
    required this.total,
    required this.difficulty,
  });

  final String category;
  final int index;
  final int total;
  final String difficulty;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                category.toUpperCase(),
                style: const TextStyle(
                  color: AppColors.onSurfaceVariant,
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Question ${index + 1} of $total',
                style: const TextStyle(
                  color: AppColors.onSurface,
                  fontSize: 20,
                  height: 1.4,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: AppColors.surfaceHigh,
            borderRadius: BorderRadius.circular(4),
          ),
          child: Text(
            difficulty,
            style: const TextStyle(
              color: AppColors.onSurface,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }
}

class _CodeBlock extends StatelessWidget {
  const _CodeBlock({required this.question});

  final AssessmentQuestion question;

  @override
  Widget build(BuildContext context) {
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: AppColors.primaryContainer,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: const BoxDecoration(
              color: AppColors.primary,
              border: Border(
                bottom: BorderSide(color: AppColors.outlineVariant),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    question.fileName,
                    style: const TextStyle(
                      color: AppColors.outlineVariant,
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                IconButton(
                  tooltip: 'Copy code',
                  visualDensity: VisualDensity.compact,
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: question.code));
                    ScaffoldMessenger.of(context)
                      ..hideCurrentSnackBar()
                      ..showSnackBar(
                        const SnackBar(content: Text('Code copied.')),
                      );
                  },
                  icon: const Icon(
                    Icons.content_copy_rounded,
                    color: AppColors.outlineVariant,
                    size: 16,
                  ),
                ),
              ],
            ),
          ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.all(8),
            child: Text(
              question.code,
              style: const TextStyle(
                color: AppColors.surfaceHigh,
                fontFamily: 'monospace',
                fontSize: 13,
                height: 1.55,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _AnswerOption extends StatelessWidget {
  const _AnswerOption({
    super.key,
    required this.option,
    required this.selected,
    required this.enabled,
    required this.onSelected,
  });

  final AssessmentOption option;
  final bool selected;
  final bool enabled;
  final VoidCallback onSelected;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? AppColors.surfaceLow : AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(6),
        side: BorderSide(
          color: selected ? AppColors.primary : AppColors.outlineVariant,
          width: selected ? 2 : 1,
        ),
      ),
      child: InkWell(
        onTap: enabled ? onSelected : null,
        borderRadius: BorderRadius.circular(6),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
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
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  option.text,
                  style: TextStyle(
                    color: AppColors.onSurface,
                    fontSize: 14,
                    height: 1.45,
                    fontWeight: selected ? FontWeight.w500 : FontWeight.w400,
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

class _AssessmentNavigation extends StatelessWidget {
  const _AssessmentNavigation({
    required this.canGoPrevious,
    required this.canGoNext,
    required this.isFinished,
    required this.onPrevious,
    required this.onGrid,
    required this.onNext,
    required this.onFinish,
  });

  final bool canGoPrevious;
  final bool canGoNext;
  final bool isFinished;
  final VoidCallback onPrevious;
  final VoidCallback onGrid;
  final VoidCallback onNext;
  final VoidCallback onFinish;

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
        bottom: false,
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            children: [
              OutlinedButton.icon(
                key: const ValueKey('assessmentPreviousButton'),
                onPressed: canGoPrevious && !isFinished ? onPrevious : null,
                icon: const Icon(Icons.chevron_left_rounded, size: 18),
                label: const Text('Previous'),
              ),
              const Spacer(),
              IconButton.filledTonal(
                key: const ValueKey('assessmentGridButton'),
                tooltip: 'Question navigation',
                onPressed: onGrid,
                icon: const Icon(Icons.grid_view_rounded),
              ),
              const Spacer(),
              FilledButton(
                key: const ValueKey('assessmentNextButton'),
                onPressed: isFinished
                    ? null
                    : canGoNext
                    ? onNext
                    : onFinish,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(canGoNext ? 'Next' : 'Finish'),
                    const SizedBox(width: 4),
                    Icon(
                      canGoNext
                          ? Icons.chevron_right_rounded
                          : Icons.check_rounded,
                      size: 18,
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

class _LegendDot extends StatelessWidget {
  const _LegendDot({required this.color, required this.label});

  final Color color;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
            border: Border.all(color: AppColors.outlineVariant),
          ),
        ),
        const SizedBox(width: 4),
        Text(
          label,
          style: const TextStyle(
            color: AppColors.onSurfaceVariant,
            fontSize: 11,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
