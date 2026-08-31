import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../dashboard/presentation/pages/candidate_dashboard_page.dart';
import '../../../dashboard/presentation/pages/employer_dashboard_page.dart';
import '../../domain/entities/login_credentials.dart';
import '../controllers/login_controller.dart';

class DashboardLoginPage extends StatefulWidget {
  const DashboardLoginPage({super.key, required this.controller});

  static const routeName = '/login';

  final LoginController controller;

  @override
  State<DashboardLoginPage> createState() => _DashboardLoginPageState();
}

class _DashboardLoginPageState extends State<DashboardLoginPage> {
  final _formKey = GlobalKey<FormState>();

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();
    if (!(_formKey.currentState?.validate() ?? false)) return;
    await widget.controller.signIn();
    if (!mounted) return;
    final route =
        widget.controller.credentials.accountType == AccountType.employer
        ? EmployerDashboardPage.routeName
        : CandidateDashboardPage.routeName;
    await Navigator.of(context).pushReplacementNamed(route);
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
                      key: _formKey,
                      child: Column(
                        children: [
                          TextFormField(
                            key: const ValueKey('dashboardEmailField'),
                            keyboardType: TextInputType.emailAddress,
                            textInputAction: TextInputAction.next,
                            validator: widget.controller.validateEmail,
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
                            validator: widget.controller.validatePassword,
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
                              onPressed: widget.controller.isLoading
                                  ? null
                                  : _submit,
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
                              child: widget.controller.isLoading
                                  ? const SizedBox.square(
                                      dimension: 18,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: Colors.white,
                                      ),
                                    )
                                  : const Text('Giriş Yap'),
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
                          onPressed: () => _showComingSoon('Kayıt'),
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
      child: Center(
        child: Text(
          'G',
          style: TextStyle(
            color: Color(0xFF4285F4),
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }
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
