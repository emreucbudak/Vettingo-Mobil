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

  @override
  void dispose() {
    widget.controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'TalentPulse',
          style: TextStyle(
            color: AppColors.primary,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        top: false,
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Container(
              width: double.infinity,
              constraints: const BoxConstraints(maxWidth: 384),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.outlineVariant),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x120B1C30),
                    blurRadius: 18,
                    offset: Offset(0, 5),
                  ),
                ],
              ),
              child: AnimatedBuilder(
                animation: widget.controller,
                builder: (context, _) => Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'Access your dashboard',
                      style: TextStyle(
                        color: AppColors.onSurfaceVariant,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 24),
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
                              'Email Address',
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
                                  'Password',
                                  Icons.lock_outline_rounded,
                                ).copyWith(
                                  suffixIcon: IconButton(
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
                          const SizedBox(height: 20),
                          SizedBox(
                            width: double.infinity,
                            height: 46,
                            child: FilledButton(
                              key: const ValueKey('dashboardSignInButton'),
                              onPressed: widget.controller.isLoading
                                  ? null
                                  : _submit,
                              style: FilledButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(6),
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
                                  : const Text('SIGN IN'),
                            ),
                          ),
                        ],
                      ),
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
      fillColor: AppColors.surface,
      border: border,
      enabledBorder: border,
      focusedBorder: border.copyWith(
        borderSide: const BorderSide(color: AppColors.primary, width: 1.4),
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
              label: 'Job Seeker',
              selected:
                  controller.credentials.accountType == AccountType.jobSeeker,
              onPressed: () =>
                  controller.selectAccountType(AccountType.jobSeeker),
            ),
          ),
          Expanded(
            child: _TypeButton(
              label: 'Employer',
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
