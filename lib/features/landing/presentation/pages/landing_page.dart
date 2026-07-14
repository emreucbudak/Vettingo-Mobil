import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/talent_pulse_shell.dart';
import '../../../auth/presentation/pages/dashboard_login_page.dart';

class LandingPage extends StatelessWidget {
  const LandingPage({super.key});

  static const routeName = '/';

  void _openLogin(BuildContext context) {
    Navigator.of(context).pushNamed(DashboardLoginPage.routeName);
  }

  void _showDemoMessage(BuildContext context) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        const SnackBar(
          content: Text('Demo talebi yakında kullanıma sunulacak.'),
        ),
      );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const TalentPulseTopBar(
        centerTitle: false,
        showAvatar: false,
        showNotifications: false,
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
                    onDemo: () => _showDemoMessage(context),
                  ),
                  const SizedBox(height: 24),
                  const _TrustStrip(),
                  const SizedBox(height: 32),
                  const _FeatureCard(
                    icon: Icons.dashboard_rounded,
                    iconColor: AppColors.primary,
                    iconSurface: AppColors.surfaceHigh,
                    title: 'Yönetici Paneli',
                    description:
                        'Tüm departmanlardaki aday havuzu hızını, çeşitlilik metriklerini ve stratejik işe alım hedeflerini tek merkezden izleyin.',
                    preview: _PipelinePreview(),
                  ),
                  const SizedBox(height: 16),
                  const _FeatureCard(
                    icon: Icons.document_scanner_rounded,
                    iconColor: Colors.white,
                    iconSurface: AppColors.surfaceTint,
                    title: 'Akıllı CV Analizi',
                    description:
                        'Temel yetkinlikleri belirlemek ve ilk elemedeki önyargıyı azaltmak için özgeçmiş verilerini nesnel biçimde analiz edin.',
                    preview: _SkillPreview(),
                  ),
                  const SizedBox(height: 16),
                  const _FeatureCard(
                    icon: Icons.bar_chart_rounded,
                    iconColor: Colors.white,
                    iconSurface: AppColors.tertiaryContainer,
                    title: 'Yetenek Karşılaştırması',
                    description:
                        'Aday profillerini sektör standartları ve şirket içindeki en başarılı profillerle gerçek zamanlı karşılaştırın.',
                    preview: _BenchmarkPreview(),
                  ),
                ],
              ),
            ),
          ),
        ),
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
              'KURUMSAL İŞE ALIM',
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
            'Hassas Yetenek\nAnalizi.',
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
              'Yapay zekâ destekli karşılaştırma ve nesnel profil analiziyle yönetici işe alım süreçlerini hızlandırın.',
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
              label: const Text('İşe Alıma Başla'),
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
              child: const Text('Demo Talep Et'),
            ),
          ),
        ],
      ),
    );
  }
}

class _TrustStrip extends StatefulWidget {
  const _TrustStrip();

  @override
  State<_TrustStrip> createState() => _TrustStripState();
}

class _TrustStripState extends State<_TrustStrip>
    with SingleTickerProviderStateMixin {
  static const _companies = <(String, String)>[
    ('Google', 'assets/images/company_logos/google.svg'),
    ('Apple', 'assets/images/company_logos/apple.svg'),
    ('Netflix', 'assets/images/company_logos/netflix.svg'),
    ('Spotify', 'assets/images/company_logos/spotify.svg'),
    ('Airbnb', 'assets/images/company_logos/airbnb.svg'),
    ('Shopify', 'assets/images/company_logos/shopify.svg'),
    ('GitHub', 'assets/images/company_logos/github.svg'),
    ('PayPal', 'assets/images/company_logos/paypal.svg'),
    ('Stripe', 'assets/images/company_logos/stripe.svg'),
    ('Uber', 'assets/images/company_logos/uber.svg'),
    ('Tesla', 'assets/images/company_logos/tesla.svg'),
    ('NVIDIA', 'assets/images/company_logos/nvidia.svg'),
  ];

  static const _cardWidth = 144.0;
  static const _gap = 40.0;
  late final AnimationController _controller;

  double get _sequenceWidth => (_cardWidth + _gap) * _companies.length;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 28),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

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
            'DÜNYANIN ÖNDE GELEN ŞİRKETLERİ TARAFINDAN GÜVENİLİYOR',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: AppColors.onSurfaceVariant,
              fontSize: 11,
              fontWeight: FontWeight.w500,
              letterSpacing: .8,
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 56,
            child: ShaderMask(
              blendMode: BlendMode.dstIn,
              shaderCallback: (bounds) => const LinearGradient(
                colors: [
                  Colors.transparent,
                  Colors.black,
                  Colors.black,
                  Colors.transparent,
                ],
                stops: [0, .12, .88, 1],
              ).createShader(bounds),
              child: ClipRect(
                child: AnimatedBuilder(
                  animation: _controller,
                  builder: (context, child) => Transform.translate(
                    key: const ValueKey('trustedCompaniesMarquee'),
                    offset: Offset(-_controller.value * _sequenceWidth, 0),
                    child: child,
                  ),
                  child: OverflowBox(
                    alignment: Alignment.centerLeft,
                    minWidth: 0,
                    maxWidth: double.infinity,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [..._companies, ..._companies]
                          .map(
                            (company) => Padding(
                              padding: const EdgeInsets.only(right: _gap),
                              child: _CompanyLogoCard(
                                name: company.$1,
                                logoUrl: company.$2,
                              ),
                            ),
                          )
                          .toList(),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CompanyLogoCard extends StatelessWidget {
  const _CompanyLogoCard({required this.name, required this.logoUrl});

  final String name;
  final String logoUrl;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      image: true,
      label: '$name logosu',
      child: Container(
        width: _TrustStripState._cardWidth,
        height: 56,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(4),
          border: Border.all(color: AppColors.outlineVariant),
          boxShadow: const [
            BoxShadow(
              color: Color(0x10091426),
              blurRadius: 5,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: ExcludeSemantics(
          child: SvgPicture.asset(
            logoUrl,
            width: 120,
            height: 32,
            fit: BoxFit.contain,
            placeholderBuilder: (context) => const SizedBox.shrink(),
          ),
        ),
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
                '3. Çeyrek Aday Havuzu',
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
        _TinyChip(label: '98% Uyum', success: true),
        _TinyChip(label: 'Liderlik'),
        _TinyChip(label: 'Strateji'),
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
              label: 'Pazar',
              height: 22,
              color: AppColors.outlineVariant,
            ),
          ),
          SizedBox(width: 8),
          Expanded(
            child: _Bar(
              label: 'Aday',
              height: 44,
              color: AppColors.primaryContainer,
            ),
          ),
          SizedBox(width: 8),
          Expanded(
            child: _Bar(
              label: 'Şirket İçi',
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
