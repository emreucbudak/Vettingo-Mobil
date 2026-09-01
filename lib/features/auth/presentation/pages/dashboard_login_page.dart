import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../dashboard/presentation/pages/candidate_dashboard_page.dart';
import '../../../hr/presentation/pages/hr_dashboard_page.dart';
import '../../domain/entities/login_credentials.dart';
import '../controllers/login_controller.dart';
import 'dashboard_register_page.dart';

class DashboardLoginPage extends StatefulWidget {
  const DashboardLoginPage({super.key, required this.controller});

  static const routeName = '/login';

  final LoginController controller;

  @override
  State<DashboardLoginPage> createState() => _DashboardLoginPageState();
}

class _DashboardLoginPageState extends State<DashboardLoginPage> {
  Future<void> _submit() async {
    FocusScope.of(context).unfocus();
    final routeName =
        widget.controller.credentials.accountType == AccountType.employer
        ? HrDashboardPage.routeName
        : CandidateDashboardPage.routeName;
    await Navigator.of(context).pushReplacementNamed(routeName);
  }

  void _showComingSoon(String label) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        SnackBar(content: Text('$label yakında kullanıma sunulacak.')),
      );
  }

  @override
  void dispose() {
    widget.controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F8F5),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            child: Container(
              width: double.infinity,
              constraints: const BoxConstraints(maxWidth: 400),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFFF8F8F5),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppColors.outlineVariant.withValues(alpha: .65),
                ),
              ),
              child: AnimatedBuilder(
                animation: widget.controller,
                builder: (context, _) => Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'Vettingo',
                      style: TextStyle(
                        color: AppColors.primary,
                        fontSize: 28,
                        height: 1.2,
                        fontWeight: FontWeight.w700,
                        letterSpacing: -.5,
                      ),
                    ),
                    const SizedBox(height: 28),
                    _AccountTypeSelector(controller: widget.controller),
                    const SizedBox(height: 24),
                    Form(
                      child: Column(
                        children: [
                          TextFormField(
                            key: const ValueKey('dashboardEmailField'),
                            keyboardType: TextInputType.emailAddress,
                            textInputAction: TextInputAction.next,
                            onChanged: widget.controller.setEmail,
                            decoration: _decoration(
                              'Email',
                              Icons.mail_outline_rounded,
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            key: const ValueKey('dashboardPasswordField'),
                            obscureText: !widget.controller.isPasswordVisible,
                            textInputAction: TextInputAction.done,
                            onChanged: widget.controller.setPassword,
                            onFieldSubmitted: (_) => _submit(),
                            decoration:
                                _decoration(
                                  'Şifre',
                                  Icons.lock_outline_rounded,
                                ).copyWith(
                                  suffixIcon: IconButton(
                                    tooltip: widget.controller.isPasswordVisible
                                        ? 'Şifreyi gizle'
                                        : 'Şifreyi göster',
                                    onPressed: widget
                                        .controller
                                        .togglePasswordVisibility,
                                    icon: Icon(
                                      widget.controller.isPasswordVisible
                                          ? Icons.visibility_off_outlined
                                          : Icons.visibility_outlined,
                                    ),
                                  ),
                                ),
                          ),
                          const SizedBox(height: 4),
                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton(
                              key: const ValueKey(
                                'dashboardForgotPasswordButton',
                              ),
                              onPressed: () =>
                                  _showComingSoon('Şifre yenileme'),
                              style: TextButton.styleFrom(
                                foregroundColor: const Color(0xFF2563EB),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 4,
                                  vertical: 8,
                                ),
                                minimumSize: Size.zero,
                                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                textStyle: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              child: const Text('Şifrenizi mi unuttunuz?'),
                            ),
                          ),
                          const SizedBox(height: 18),
                          SizedBox(
                            width: double.infinity,
                            height: 48,
                            child: FilledButton(
                              key: const ValueKey('dashboardSignInButton'),
                              onPressed: _submit,
                              style: FilledButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(7),
                                ),
                                textStyle: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              child: const Text('Giriş Yap'),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    const _SocialDivider(),
                    const SizedBox(height: 18),
                    _SocialLoginButton(
                      key: const ValueKey('dashboardLinkedInButton'),
                      label: 'LinkedIn ile Giriş Yap',
                      mark: const _LinkedInMark(),
                      onPressed: () => _showComingSoon('LinkedIn ile giriş'),
                    ),
                    const SizedBox(height: 10),
                    _SocialLoginButton(
                      key: const ValueKey('dashboardGoogleButton'),
                      label: 'Google ile Giriş Yap',
                      mark: const _GoogleMark(),
                      onPressed: () => _showComingSoon('Google ile giriş'),
                    ),
                    const SizedBox(height: 24),
                    Wrap(
                      alignment: WrapAlignment.center,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      spacing: 4,
                      children: [
                        const Text(
                          'Henüz kayıtlı değil misiniz?',
                          style: TextStyle(
                            color: AppColors.onSurfaceVariant,
                            fontSize: 13,
                          ),
                        ),
                        TextButton(
                          key: const ValueKey('dashboardRegisterButton'),
                          onPressed: () => Navigator.of(
                            context,
                          ).pushNamed(DashboardRegisterPage.routeName),
                          style: TextButton.styleFrom(
                            foregroundColor: const Color(0xFF2563EB),
                            padding: EdgeInsets.zero,
                            minimumSize: Size.zero,
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            textStyle: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          child: const Text('Kayıt Olun.'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _decoration(String hint, IconData icon) {
    final border = OutlineInputBorder(
      borderRadius: BorderRadius.circular(6),
      borderSide: const BorderSide(color: AppColors.outlineVariant),
    );
    return InputDecoration(
      hintText: hint,
      prefixIcon: Icon(icon, size: 20),
      filled: true,
      fillColor: Colors.white,
      border: border,
      enabledBorder: border,
      focusedBorder: border.copyWith(
        borderSide: const BorderSide(color: AppColors.primary, width: 1.4),
      ),
    );
  }
}

class _SocialDivider extends StatelessWidget {
  const _SocialDivider();

  @override
  Widget build(BuildContext context) {
    return const Row(
      children: [
        Expanded(child: Divider(color: AppColors.outlineVariant, height: 1)),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 12),
          child: Text(
            'veya',
            style: TextStyle(
              color: AppColors.outline,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        Expanded(child: Divider(color: AppColors.outlineVariant, height: 1)),
      ],
    );
  }
}

class _SocialLoginButton extends StatelessWidget {
  const _SocialLoginButton({
    super.key,
    required this.label,
    required this.mark,
    required this.onPressed,
  });

  final String label;
  final Widget mark;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 46,
      child: OutlinedButton.icon(
        onPressed: onPressed,
        icon: mark,
        label: Text(label),
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.onSurface,
          backgroundColor: Colors.white,
          side: const BorderSide(color: AppColors.outlineVariant),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(7)),
          textStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
        ),
      ),
    );
  }
}

class _GoogleMark extends StatelessWidget {
  const _GoogleMark();

  @override
  Widget build(BuildContext context) {
    return const SizedBox.square(
      dimension: 20,
      child: CustomPaint(painter: _GoogleLogoPainter()),
    );
  }
}

class _GoogleLogoPainter extends CustomPainter {
  const _GoogleLogoPainter();

  @override
  void paint(Canvas canvas, Size size) {
    canvas.save();
    canvas.scale(size.width / 18, size.height / 18);

    final bluePath = Path()
      ..moveTo(17.64, 9.2045)
      ..relativeCubicTo(0, -.638, -.0573, -1.2518, -.1636, -1.8409)
      ..lineTo(9, 7.3636)
      ..relativeLineTo(0, 3.4818)
      ..relativeLineTo(4.8436, 0)
      ..relativeCubicTo(-.2086, 1.125, -.8427, 2.0782, -1.7964, 2.7164)
      ..relativeLineTo(0, 2.2582)
      ..relativeLineTo(2.9082, 0)
      ..relativeCubicTo(1.702, -1.5668, 2.6846, -3.8741, 2.6846, -6.6155)
      ..close();
    canvas.drawPath(bluePath, Paint()..color = const Color(0xFF4285F4));

    final greenPath = Path()
      ..moveTo(9, 18)
      ..relativeCubicTo(2.43, 0, 4.4673, -.8059, 5.9564, -2.18)
      ..relativeLineTo(-2.9082, -2.2582)
      ..relativeCubicTo(-.8059, .54, -1.8368, .8591, -3.0482, .8591)
      ..relativeCubicTo(-2.3441, 0, -4.3286, -1.5859, -5.0373, -3.7173)
      ..lineTo(.9564, 10.7036)
      ..relativeLineTo(0, 2.3327)
      ..arcToPoint(
        const Offset(9, 18),
        radius: const Radius.circular(9),
        clockwise: false,
      )
      ..close();
    canvas.drawPath(greenPath, Paint()..color = const Color(0xFF34A853));

    final yellowPath = Path()
      ..moveTo(3.9627, 10.7036)
      ..arcToPoint(
        const Offset(3.6818, 9),
        radius: const Radius.circular(5.41),
        clockwise: true,
      )
      ..relativeCubicTo(0, -.5909, .1014, -1.1645, .2809, -1.7036)
      ..lineTo(3.9627, 4.9636)
      ..lineTo(.9564, 4.9636)
      ..arcToPoint(
        const Offset(0, 9),
        radius: const Radius.circular(9),
        clockwise: false,
      )
      ..relativeCubicTo(0, 1.45, .3477, 2.8236, .9564, 4.0364)
      ..relativeLineTo(3.0063, -2.3328)
      ..close();
    canvas.drawPath(yellowPath, Paint()..color = const Color(0xFFFBBC05));

    final redPath = Path()
      ..moveTo(9, 3.5791)
      ..relativeCubicTo(1.3214, 0, 2.5077, .4545, 3.4423, 1.3459)
      ..relativeLineTo(2.5813, -2.5814)
      ..cubicTo(13.4632, .8918, 11.43, 0, 9, 0)
      ..arcToPoint(
        const Offset(.9564, 4.9636),
        radius: const Radius.circular(9),
        clockwise: false,
      )
      ..relativeLineTo(3.0063, 2.3328)
      ..cubicTo(4.6714, 5.165, 6.6559, 3.5791, 9, 3.5791)
      ..close();
    canvas.drawPath(redPath, Paint()..color = const Color(0xFFEA4335));

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _GoogleLogoPainter oldDelegate) => false;
}

class _LinkedInMark extends StatelessWidget {
  const _LinkedInMark();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 19,
      height: 19,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: const Color(0xFF0A66C2),
        borderRadius: BorderRadius.circular(2),
      ),
      child: const Text(
        'in',
        style: TextStyle(
          color: Colors.white,
          fontSize: 12,
          height: 1,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}

class _AccountTypeSelector extends StatelessWidget {
  const _AccountTypeSelector({required this.controller});

  final LoginController controller;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.surfaceHigh,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        children: [
          Expanded(
            child: _TypeButton(
              label: 'İş Arayan',
              selected:
                  controller.credentials.accountType == AccountType.jobSeeker,
              onPressed: () =>
                  controller.selectAccountType(AccountType.jobSeeker),
            ),
          ),
          Expanded(
            child: _TypeButton(
              label: 'İşveren',
              selected:
                  controller.credentials.accountType == AccountType.employer,
              onPressed: () =>
                  controller.selectAccountType(AccountType.employer),
            ),
          ),
        ],
      ),
    );
  }
}

class _TypeButton extends StatelessWidget {
  const _TypeButton({
    required this.label,
    required this.selected,
    required this.onPressed,
  });

  final String label;
  final bool selected;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 36,
      child: TextButton(
        onPressed: onPressed,
        style: TextButton.styleFrom(
          backgroundColor: selected ? AppColors.primary : Colors.transparent,
          foregroundColor: selected ? Colors.white : AppColors.onSurfaceVariant,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
          textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
        ),
        child: Text(label),
      ),
    );
  }
}
