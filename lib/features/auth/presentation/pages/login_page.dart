import 'package:flutter/material.dart';

import '../../domain/entities/login_credentials.dart';
import '../controllers/login_controller.dart';
import '../../../talent_comparison/presentation/pages/talent_comparison_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key, required this.controller});

  final LoginController controller;

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  static const primary = Color(0xFF091426);
  static const onSurface = Color(0xFF0B1C30);
  static const onSurfaceVariant = Color(0xFF45474C);
  static const outline = Color(0xFFC5C6CD);
  static const fieldSurface = Color(0xFFF8F9FF);
  static const toggleSurface = Color(0xFFDCE9FF);

  final _formKey = GlobalKey<FormState>();
  late final LoginController _controller;

  @override
  void initState() {
    super.initState();
    _controller = widget.controller;
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();
    if (!(_formKey.currentState?.validate() ?? false)) return;
    await _controller.signIn();
    if (!mounted) return;
    await Navigator.of(context).pushNamed(TalentComparisonPage.routeName);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          const Positioned(
            left: -130,
            top: -100,
            child: _BackgroundGlow(color: Color(0xFFD8E3FB), size: 330),
          ),
          const Positioned(
            right: -120,
            bottom: -90,
            child: _BackgroundGlow(color: Color(0xFFE1E0FF), size: 290),
          ),
          SafeArea(
            child: LayoutBuilder(
              builder: (context, constraints) {
                return SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                      minHeight: constraints.maxHeight - 32,
                    ),
                    child: Center(
                      child: Container(
                        width: double.infinity,
                        constraints: const BoxConstraints(maxWidth: 384),
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: outline.withValues(alpha: 0.35),
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x120B1C30),
                              blurRadius: 18,
                              offset: Offset(0, 5),
                            ),
                          ],
                        ),
                        child: AnimatedBuilder(
                          animation: _controller,
                          builder: (context, _) => _buildContent(),
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContent() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Text(
          'TalentPulse',
          style: TextStyle(
            color: primary,
            fontSize: 20,
            height: 1.4,
            fontWeight: FontWeight.w600,
            letterSpacing: -0.2,
          ),
        ),
        const SizedBox(height: 4),
        const Text(
          'Access your dashboard',
          style: TextStyle(color: onSurfaceVariant, fontSize: 14, height: 1.4),
        ),
        const SizedBox(height: 24),
        _AccountTypeToggle(controller: _controller),
        const SizedBox(height: 24),
        Form(
          key: _formKey,
          child: Column(
            children: [
              _LoginTextField(
                key: const ValueKey('emailField'),
                hintText: 'Email Address',
                prefixIcon: Icons.mail_outline_rounded,
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                autofillHints: const [AutofillHints.email],
                validator: _controller.validateEmail,
                onChanged: _controller.setEmail,
              ),
              const SizedBox(height: 16),
              _LoginTextField(
                key: const ValueKey('passwordField'),
                hintText: 'Password',
                prefixIcon: Icons.lock_outline_rounded,
                obscureText: !_controller.isPasswordVisible,
                textInputAction: TextInputAction.done,
                autofillHints: const [AutofillHints.password],
                validator: _controller.validatePassword,
                onChanged: _controller.setPassword,
                onSubmitted: (_) => _submit(),
                suffixIcon: IconButton(
                  key: const ValueKey('passwordVisibilityButton'),
                  tooltip: _controller.isPasswordVisible
                      ? 'Hide password'
                      : 'Show password',
                  onPressed: _controller.togglePasswordVisibility,
                  icon: Icon(
                    _controller.isPasswordVisible
                        ? Icons.visibility_off_outlined
                        : Icons.visibility_outlined,
                    size: 20,
                  ),
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        SizedBox(
                          width: 22,
                          height: 22,
                          child: Checkbox(
                            key: const ValueKey('rememberMeCheckbox'),
                            value: _controller.credentials.rememberMe,
                            activeColor: primary,
                            side: const BorderSide(color: outline),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(4),
                            ),
                            onChanged: (value) =>
                                _controller.setRememberMe(value ?? false),
                          ),
                        ),
                        const SizedBox(width: 6),
                        const Flexible(
                          child: Text(
                            'Remember me',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              color: onSurfaceVariant,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Flexible(
                    child: Align(
                      alignment: Alignment.centerRight,
                      child: _CompactTextButton(
                        label: 'Forgot Password?',
                        onPressed: () {},
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                height: 42,
                child: FilledButton(
                  key: const ValueKey('signInButton'),
                  onPressed: _controller.isLoading ? null : _submit,
                  style: FilledButton.styleFrom(
                    backgroundColor: primary,
                    foregroundColor: Colors.white,
                    disabledBackgroundColor: primary.withValues(alpha: 0.7),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(6),
                    ),
                    textStyle: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.6,
                    ),
                  ),
                  child: _controller.isLoading
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
        const SizedBox(height: 24),
        const _DividerLabel(),
        const SizedBox(height: 20),
        _SocialButton(
          label: 'Google',
          mark: const _GoogleMark(),
          onPressed: () {},
        ),
        const SizedBox(height: 8),
        _SocialButton(
          label: 'LinkedIn',
          mark: const _LinkedInMark(),
          onPressed: () {},
        ),
        const SizedBox(height: 22),
        Wrap(
          alignment: WrapAlignment.center,
          crossAxisAlignment: WrapCrossAlignment.center,
          spacing: 6,
          children: [
            const Text(
              "Don't have an account?",
              style: TextStyle(color: onSurfaceVariant, fontSize: 13),
            ),
            _CompactTextButton(label: 'Register', onPressed: () {}, leftPad: 0),
          ],
        ),
      ],
    );
  }
}

class _AccountTypeToggle extends StatelessWidget {
  const _AccountTypeToggle({required this.controller});

  final LoginController controller;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: _LoginPageState.toggleSurface,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        children: [
          Expanded(
            child: _ToggleButton(
              label: 'Job Seeker',
              selected:
                  controller.credentials.accountType == AccountType.jobSeeker,
              onPressed: () =>
                  controller.selectAccountType(AccountType.jobSeeker),
            ),
          ),
          Expanded(
            child: _ToggleButton(
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

class _ToggleButton extends StatelessWidget {
  const _ToggleButton({
    required this.label,
    required this.selected,
    required this.onPressed,
  });

  final String label;
  final bool selected;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      selected: selected,
      button: true,
      child: SizedBox(
        height: 34,
        child: TextButton(
          onPressed: onPressed,
          style: TextButton.styleFrom(
            backgroundColor: selected ? _LoginPageState.primary : null,
            foregroundColor: selected
                ? Colors.white
                : _LoginPageState.onSurfaceVariant,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(5),
            ),
            textStyle: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.6,
            ),
          ),
          child: Text(label),
        ),
      ),
    );
  }
}

class _LoginTextField extends StatelessWidget {
  const _LoginTextField({
    super.key,
    required this.hintText,
    required this.prefixIcon,
    required this.validator,
    required this.onChanged,
    this.keyboardType,
    this.textInputAction,
    this.autofillHints,
    this.obscureText = false,
    this.suffixIcon,
    this.onSubmitted,
  });

  final String hintText;
  final IconData prefixIcon;
  final FormFieldValidator<String> validator;
  final ValueChanged<String> onChanged;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final Iterable<String>? autofillHints;
  final bool obscureText;
  final Widget? suffixIcon;
  final ValueChanged<String>? onSubmitted;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      keyboardType: keyboardType,
      textInputAction: textInputAction,
      autofillHints: autofillHints,
      obscureText: obscureText,
      validator: validator,
      onChanged: onChanged,
      onFieldSubmitted: onSubmitted,
      cursorColor: _LoginPageState.primary,
      style: const TextStyle(
        color: _LoginPageState.onSurface,
        fontSize: 14,
        height: 1.4,
      ),
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: const TextStyle(color: Color(0xFF75777D), fontSize: 14),
        prefixIcon: Icon(prefixIcon, color: const Color(0xFF75777D), size: 20),
        prefixIconConstraints: const BoxConstraints(minWidth: 42),
        suffixIcon: suffixIcon,
        filled: true,
        fillColor: _LoginPageState.fieldSurface,
        isDense: true,
        contentPadding: const EdgeInsets.symmetric(
          vertical: 13,
          horizontal: 12,
        ),
        enabledBorder: _border(_LoginPageState.outline),
        focusedBorder: _border(_LoginPageState.primary, width: 1.4),
        errorBorder: _border(const Color(0xFFBA1A1A)),
        focusedErrorBorder: _border(const Color(0xFFBA1A1A), width: 1.4),
      ),
    );
  }

  OutlineInputBorder _border(Color color, {double width = 1}) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(6),
      borderSide: BorderSide(color: color, width: width),
    );
  }
}

class _CompactTextButton extends StatelessWidget {
  const _CompactTextButton({
    required this.label,
    required this.onPressed,
    this.leftPad = 6,
  });

  final String label;
  final VoidCallback onPressed;
  final double leftPad;

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        foregroundColor: _LoginPageState.primary,
        padding: EdgeInsets.only(left: leftPad),
        minimumSize: Size.zero,
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
        textStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
      ),
      child: Text(label, maxLines: 1, overflow: TextOverflow.ellipsis),
    );
  }
}

class _DividerLabel extends StatelessWidget {
  const _DividerLabel();

  @override
  Widget build(BuildContext context) {
    return const Row(
      children: [
        Expanded(child: Divider(color: _LoginPageState.outline, height: 1)),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 12),
          child: Text(
            'OR CONTINUE WITH',
            style: TextStyle(
              color: Color(0xFF75777D),
              fontSize: 11,
              fontWeight: FontWeight.w500,
              letterSpacing: 1,
            ),
          ),
        ),
        Expanded(child: Divider(color: _LoginPageState.outline, height: 1)),
      ],
    );
  }
}

class _SocialButton extends StatelessWidget {
  const _SocialButton({
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
      height: 42,
      child: OutlinedButton.icon(
        onPressed: onPressed,
        icon: mark,
        label: Text(label),
        style: OutlinedButton.styleFrom(
          foregroundColor: _LoginPageState.onSurface,
          side: const BorderSide(color: _LoginPageState.outline),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
          textStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.w400),
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

class _BackgroundGlow extends StatelessWidget {
  const _BackgroundGlow({required this.color, required this.size});

  final Color color;
  final double size;

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(
            colors: [color.withValues(alpha: 0.65), color.withValues(alpha: 0)],
          ),
        ),
      ),
    );
  }
}
