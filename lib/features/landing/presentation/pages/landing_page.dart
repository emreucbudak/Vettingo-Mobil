import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/talent_pulse_shell.dart';
import '../../../auth/presentation/pages/dashboard_login_page.dart';

class LandingPage extends StatelessWidget {
  const LandingPage({super.key});

  static const routeName = '/';

  void _openLogin(BuildContext context) {
    Navigator.of(context).pushNamed(DashboardLoginPage.routeName);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: TalentPulseTopBar(
        avatarLabel: 'TP',
        centerTitle: false,
        onNotifications: () => showComingSoon(context, 'Notifications'),
      ),
      body: CustomPaint(
        painter: const _GridPainter(),
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 24, 16, 32),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 560),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _Hero(
                    onStartHiring: () => _openLogin(context),
                    onDemo: () => showComingSoon(context, 'Demo request'),
                  ),
                  const SizedBox(height: 24),
                  const _TrustStrip(),
                  const SizedBox(height: 32),
                  const _FeatureCard(
                    icon: Icons.dashboard_rounded,
                    iconColor: AppColors.primary,
                    iconSurface: AppColors.surfaceHigh,
                    title: 'Executive Dashboard',
                    description:
                        'Centralized visibility into pipeline velocity, diversity metrics, and strategic hiring goals across all departments.',
                    preview: _PipelinePreview(),
                  ),
                  const SizedBox(height: 16),
                  const _FeatureCard(
                    icon: Icons.document_scanner_rounded,
                    iconColor: Colors.white,
                    iconSurface: AppColors.surfaceTint,
                    title: 'Smart CV Analysis',
                    description:
                        'Objective parsing of unstructured resume data to identify core competencies and eliminate initial screening bias.',
                    preview: _SkillPreview(),
                  ),
                  const SizedBox(height: 16),
                  const _FeatureCard(
                    icon: Icons.bar_chart_rounded,
                    iconColor: Colors.white,
                    iconSurface: AppColors.tertiaryContainer,
                    title: 'Talent Benchmarking',
                    description:
                        'Compare candidate profiles against industry standards and top-performing internal benchmarks in real-time.',
                    preview: _BenchmarkPreview(),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      bottomNavigationBar: TalentPulseBottomBar(
        onSelected: (index) {
          if (index != 0) {
            showComingSoon(
              context,
              const ['Home', 'Apps', 'Search', 'Jobs'][index],
            );
          }
        },
      ),
    );
  }
}

class _Hero extends StatelessWidget {
  const _Hero({required this.onStartHiring, required this.onDemo});

  final VoidCallback onStartHiring;
  final VoidCallback onDemo;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
            decoration: BoxDecoration(
              color: AppColors.surfaceHigh,
              borderRadius: BorderRadius.circular(999),
              border: Border.all(
                color: AppColors.outlineVariant.withValues(alpha: .3),
              ),
            ),
            child: const Text(
              'ENTERPRISE RECRUITMENT',
              style: TextStyle(
                color: AppColors.primary,
                fontSize: 12,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.2,
              ),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Precision Talent\nIntelligence.',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: AppColors.primary,
              fontSize: 32,
              height: 1.25,
              fontWeight: FontWeight.w600,
              letterSpacing: -.64,
            ),
          ),
          const SizedBox(height: 16),
          const SizedBox(
            width: 300,
            child: Text(
              'Accelerate executive hiring with AI-driven benchmarking and objective profile analysis.',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: AppColors.onSurfaceVariant,
                fontSize: 16,
                height: 1.5,
              ),
            ),
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: FilledButton.icon(
              key: const ValueKey('startHiringButton'),
              onPressed: onStartHiring,
              iconAlignment: IconAlignment.end,
              icon: const Icon(Icons.arrow_forward_rounded, size: 20),
              label: const Text('Start Hiring'),
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(4),
                ),
                textStyle: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: OutlinedButton(
              onPressed: onDemo,
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.primary,
                side: const BorderSide(color: AppColors.primary),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(4),
                ),
                textStyle: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                ),
              ),
              child: const Text('Request a Demo'),
            ),
          ),
        ],
      ),
    );
  }
}

class _TrustStrip extends StatelessWidget {
  const _TrustStrip();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 22, horizontal: 12),
      decoration: const BoxDecoration(
        color: Color(0xCCFFFFFF),
        border: Border.symmetric(
          horizontal: BorderSide(color: AppColors.outlineVariant),
        ),
      ),
      child: Column(
        children: [
          const Text(
            'TRUSTED BY INDUSTRY LEADERS',
            style: TextStyle(
              color: AppColors.onSurfaceVariant,
              fontSize: 11,
              fontWeight: FontWeight.w500,
              letterSpacing: .8,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              _CompanyMark(label: 'Axiom', shape: _MarkShape.square),
              _CompanyMark(label: 'Vertex', shape: _MarkShape.circle),
              _CompanyMark(label: 'Nexus', shape: _MarkShape.dot),
            ],
          ),
        ],
      ),
    );
  }
}

enum _MarkShape { square, circle, dot }

class _CompanyMark extends StatelessWidget {
  const _CompanyMark({required this.label, required this.shape});

  final String label;
  final _MarkShape shape;

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: .65,
      child: Row(
        children: [
          Container(
            width: 22,
            height: 22,
            decoration: BoxDecoration(
              color: shape == _MarkShape.circle
                  ? Colors.transparent
                  : AppColors.primary,
              shape: shape == _MarkShape.circle
                  ? BoxShape.circle
                  : BoxShape.rectangle,
              border: shape == _MarkShape.circle
                  ? Border.all(color: AppColors.primary, width: 2)
                  : null,
              borderRadius: shape == _MarkShape.circle
                  ? null
                  : BorderRadius.circular(3),
            ),
            child: shape == _MarkShape.dot
                ? const Center(
                    child: CircleAvatar(
                      radius: 3,
                      backgroundColor: Colors.white,
                    ),
                  )
                : null,
          ),
          const SizedBox(width: 5),
          Text(
            label,
            style: const TextStyle(
              color: AppColors.onSurface,
              fontSize: 17,
              fontWeight: FontWeight.w700,
              letterSpacing: -.5,
            ),
          ),
        ],
      ),
    );
  }
}

class _FeatureCard extends StatelessWidget {
  const _FeatureCard({
    required this.icon,
    required this.iconColor,
    required this.iconSurface,
    required this.title,
    required this.description,
    required this.preview,
  });

  final IconData icon;
  final Color iconColor;
  final Color iconSurface;
  final String title;
  final String description;
  final Widget preview;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: iconSurface,
              borderRadius: BorderRadius.circular(4),
            ),
            child: Icon(icon, color: iconColor, size: 22),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: const TextStyle(
              color: AppColors.primary,
              fontSize: 20,
              height: 1.4,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: const TextStyle(
              color: AppColors.onSurfaceVariant,
              fontSize: 14,
              height: 1.45,
            ),
          ),
          const SizedBox(height: 16),
          preview,
        ],
      ),
    );
  }
}

class _PipelinePreview extends StatelessWidget {
  const _PipelinePreview();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(4),
        border: Border.all(
          color: AppColors.outlineVariant.withValues(alpha: .5),
        ),
      ),
      child: const Column(
        children: [
          Row(
            children: [
              Text(
                'Q3 Pipeline',
                style: TextStyle(
                  fontSize: 11,
                  color: AppColors.onSurfaceVariant,
                ),
              ),
              Spacer(),
              Text(
                '+12%',
                style: TextStyle(
                  fontSize: 11,
                  color: AppColors.success,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          SizedBox(height: 10),
          LinearProgressIndicator(
            value: .65,
            minHeight: 8,
            backgroundColor: AppColors.surfaceLow,
            valueColor: AlwaysStoppedAnimation(AppColors.primary),
            borderRadius: BorderRadius.all(Radius.circular(999)),
          ),
        ],
      ),
    );
  }
}

class _SkillPreview extends StatelessWidget {
  const _SkillPreview();

  @override
  Widget build(BuildContext context) {
    return const Wrap(
      spacing: 5,
      runSpacing: 5,
      children: [
        _TinyChip(label: '98% Match', success: true),
        _TinyChip(label: 'Leadership'),
        _TinyChip(label: 'Strategy'),
      ],
    );
  }
}

class _TinyChip extends StatelessWidget {
  const _TinyChip({required this.label, this.success = false});

  final String label;
  final bool success;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
      decoration: BoxDecoration(
        color: success ? AppColors.successSurface : AppColors.surfaceHigh,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: success ? AppColors.success : AppColors.primary,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class _BenchmarkPreview extends StatelessWidget {
  const _BenchmarkPreview();

  @override
  Widget build(BuildContext context) {
    return const SizedBox(
      height: 70,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Expanded(
            child: _Bar(
              label: 'Market',
              height: 22,
              color: AppColors.outlineVariant,
            ),
          ),
          SizedBox(width: 8),
          Expanded(
            child: _Bar(
              label: 'Candidate',
              height: 44,
              color: AppColors.primaryContainer,
            ),
          ),
          SizedBox(width: 8),
          Expanded(
            child: _Bar(
              label: 'Internal',
              height: 33,
              color: AppColors.surfaceTint,
            ),
          ),
        ],
      ),
    );
  }
}

class _Bar extends StatelessWidget {
  const _Bar({required this.label, required this.height, required this.color});

  final String label;
  final double height;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 9,
            color: AppColors.onSurfaceVariant,
          ),
        ),
        const SizedBox(height: 4),
        Container(
          height: height,
          decoration: BoxDecoration(
            color: color,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(3)),
          ),
        ),
      ],
    );
  }
}

class _GridPainter extends CustomPainter {
  const _GridPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.outlineVariant.withValues(alpha: .1)
      ..strokeWidth = 1;
    for (double x = 0; x < size.width; x += 24) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += 24) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
