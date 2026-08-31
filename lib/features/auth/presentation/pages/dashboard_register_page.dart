import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';

enum _RegisterAccountType { jobSeeker, employer }

class DashboardRegisterPage extends StatefulWidget {
  const DashboardRegisterPage({super.key});

  static const routeName = '/register';

  @override
  State<DashboardRegisterPage> createState() => _DashboardRegisterPageState();
}

class _DashboardRegisterPageState extends State<DashboardRegisterPage> {
  final _formKey = GlobalKey<FormState>();

  _RegisterAccountType _accountType = _RegisterAccountType.jobSeeker;
  bool _isPasswordVisible = false;
  bool _termsAccepted = false;
  bool _showTermsError = false;

  void _submit() {
    FocusScope.of(context).unfocus();
    final isFormValid = _formKey.currentState?.validate() ?? false;
    setState(() => _showTermsError = !_termsAccepted);
    if (!isFormValid || !_termsAccepted) return;

    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        const SnackBar(
          content: Text('Kayıt işlemi yakında kullanıma sunulacak.'),
        ),
      );
  }

  String? _requiredField(String? value, String message) {
    if (value == null || value.trim().isEmpty) return message;
    return null;
  }

  String? _validateEmail(String? value) {
    final requiredError = _requiredField(value, 'E-posta adresinizi girin.');
    if (requiredError != null) return requiredError;
    final email = value!.trim();
    if (!RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(email)) {
      return 'Geçerli bir e-posta adresi girin.';
    }
    return null;
  }

  String? _validatePassword(String? value) {
    final password = value ?? '';
    if (password.isEmpty) return 'Şifrenizi girin.';
    if (password.length < 6) return 'Şifre en az 6 karakter olmalıdır.';
    if (!RegExp(r'[A-ZÇĞİÖŞÜ]').hasMatch(password)) {
      return 'Şifre en az bir büyük harf içermelidir.';
    }
    if (!RegExp(r'[a-zçğıöşü]').hasMatch(password)) {
      return 'Şifre en az bir küçük harf içermelidir.';
    }
    if (!RegExp(r'[0-9]').hasMatch(password)) {
      return 'Şifre en az bir rakam içermelidir.';
    }
    if (!RegExp(r'[^A-Za-z0-9ÇĞİÖŞÜçğıöşü]').hasMatch(password)) {
      return 'Şifre en az bir özel karakter içermelidir.';
    }
    return null;
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
              key: const ValueKey('dashboardRegisterPage'),
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
              child: Column(
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
                  _AccountTypeSelector(
                    selectedType: _accountType,
                    onChanged: (type) => setState(() => _accountType = type),
                  ),
                  const SizedBox(height: 24),
                  Form(
                    key: _formKey,
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _RegisterField(
                          fieldKey: const ValueKey('registerNameField'),
                          label: 'Ad',
                          hint: 'Adınız',
                          icon: Icons.badge_outlined,
                          textInputAction: TextInputAction.next,
                          autofillHints: const [AutofillHints.givenName],
                          validator: (value) =>
                              _requiredField(value, 'Adınızı girin.'),
                        ),
                        const SizedBox(height: 16),
                        _RegisterField(
                          fieldKey: const ValueKey('registerSurnameField'),
                          label: 'Soyad',
                          hint: 'Soyadınız',
                          icon: Icons.badge_outlined,
                          textInputAction: TextInputAction.next,
                          autofillHints: const [AutofillHints.familyName],
                          validator: (value) =>
                              _requiredField(value, 'Soyadınızı girin.'),
                        ),
                        const SizedBox(height: 16),
                        _RegisterField(
                          fieldKey: const ValueKey('registerEmailField'),
                          label: 'E-posta Adresi',
                          hint: 'ornek@sirket.com',
                          icon: Icons.mail_outline_rounded,
                          keyboardType: TextInputType.emailAddress,
                          textInputAction: TextInputAction.next,
                          autofillHints: const [AutofillHints.email],
                          validator: _validateEmail,
                        ),
                        const SizedBox(height: 16),
                        _RegisterField(
                          fieldKey: const ValueKey('registerPasswordField'),
                          label: 'Şifre',
                          hint: '••••••••',
                          icon: Icons.lock_outline_rounded,
                          obscureText: !_isPasswordVisible,
                          textInputAction:
                              _accountType == _RegisterAccountType.employer
                              ? TextInputAction.next
                              : TextInputAction.done,
                          autofillHints: const [AutofillHints.newPassword],
                          validator: _validatePassword,
                          suffixIcon: IconButton(
                            tooltip: _isPasswordVisible
                                ? 'Şifreyi gizle'
                                : 'Şifreyi göster',
                            onPressed: () => setState(
                              () => _isPasswordVisible = !_isPasswordVisible,
                            ),
                            icon: Icon(
                              _isPasswordVisible
                                  ? Icons.visibility_off_outlined
                                  : Icons.visibility_outlined,
                            ),
                          ),
                          onFieldSubmitted:
                              _accountType == _RegisterAccountType.jobSeeker
                              ? (_) => _submit()
                              : null,
                        ),
                        if (_accountType == _RegisterAccountType.employer) ...[
                          const SizedBox(height: 16),
                          _RegisterField(
                            fieldKey: const ValueKey('registerCompanyField'),
                            label: 'Şirket Adı',
                            hint: 'Şirketinizin adı',
                            icon: Icons.business_outlined,
                            textInputAction: TextInputAction.done,
                            autofillHints: const [
                              AutofillHints.organizationName,
                            ],
                            validator: (value) =>
                                _requiredField(value, 'Şirket adını girin.'),
                            onFieldSubmitted: (_) => _submit(),
                          ),
                        ],
                        const SizedBox(height: 18),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            SizedBox(
                              width: 24,
                              height: 24,
                              child: Checkbox(
                                key: const ValueKey('registerTermsCheckbox'),
                                value: _termsAccepted,
                                activeColor: AppColors.primary,
                                side: const BorderSide(
                                  color: AppColors.outline,
                                ),
                                onChanged: (value) => setState(() {
                                  _termsAccepted = value ?? false;
                                  _showTermsError = false;
                                }),
                              ),
                            ),
                            const SizedBox(width: 10),
                            const Expanded(
                              child: Text(
                                'Kullanım koşullarını ve gizlilik politikasını kabul ediyorum.',
                                style: TextStyle(
                                  color: AppColors.onSurfaceVariant,
                                  fontSize: 12,
                                  height: 1.4,
                                ),
                              ),
                            ),
                          ],
                        ),
                        if (_showTermsError) ...[
                          const SizedBox(height: 6),
                          const Padding(
                            padding: EdgeInsets.only(left: 34),
                            child: Text(
                              'Devam etmek için koşulları kabul edin.',
                              style: TextStyle(color: Colors.red, fontSize: 12),
                            ),
                          ),
                        ],
                        const SizedBox(height: 22),
                        SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: FilledButton(
                            key: const ValueKey('registerSubmitButton'),
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
                            child: const Text('Kayıt Ol'),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  const _RegisterDivider(),
                  const SizedBox(height: 20),
                  Wrap(
                    alignment: WrapAlignment.center,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    spacing: 4,
                    children: [
                      const Text(
                        'Zaten hesabınız var mı?',
                        style: TextStyle(
                          color: AppColors.onSurfaceVariant,
                          fontSize: 13,
                        ),
                      ),
                      TextButton(
                        key: const ValueKey('registerLoginButton'),
                        onPressed: () => Navigator.of(context).maybePop(),
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
                        child: const Text('Giriş Yap'),
                      ),
                    ],
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

class _RegisterField extends StatelessWidget {
  const _RegisterField({
    required this.fieldKey,
    required this.label,
    required this.hint,
    required this.icon,
    required this.validator,
    this.keyboardType,
    this.textInputAction,
    this.autofillHints,
    this.obscureText = false,
    this.suffixIcon,
    this.onFieldSubmitted,
  });

  final Key fieldKey;
  final String label;
  final String hint;
  final IconData icon;
  final FormFieldValidator<String> validator;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final Iterable<String>? autofillHints;
  final bool obscureText;
  final Widget? suffixIcon;
  final ValueChanged<String>? onFieldSubmitted;

  @override
  Widget build(BuildContext context) {
    final border = OutlineInputBorder(
      borderRadius: BorderRadius.circular(6),
      borderSide: const BorderSide(color: AppColors.outlineVariant),
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: AppColors.onSurface,
            fontSize: 12,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 6),
        TextFormField(
          key: fieldKey,
          keyboardType: keyboardType,
          textInputAction: textInputAction,
          autofillHints: autofillHints,
          obscureText: obscureText,
          validator: validator,
          onFieldSubmitted: onFieldSubmitted,
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: Icon(icon, size: 20),
            suffixIcon: suffixIcon,
            filled: true,
            fillColor: Colors.white,
            border: border,
            enabledBorder: border,
            focusedBorder: border.copyWith(
              borderSide: const BorderSide(
                color: AppColors.primary,
                width: 1.4,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _RegisterDivider extends StatelessWidget {
  const _RegisterDivider();

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

class _AccountTypeSelector extends StatelessWidget {
  const _AccountTypeSelector({
    required this.selectedType,
    required this.onChanged,
  });

  final _RegisterAccountType selectedType;
  final ValueChanged<_RegisterAccountType> onChanged;

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
              key: const ValueKey('registerJobSeekerButton'),
              label: 'İş Arayan',
              selected: selectedType == _RegisterAccountType.jobSeeker,
              onPressed: () => onChanged(_RegisterAccountType.jobSeeker),
            ),
          ),
          Expanded(
            child: _TypeButton(
              key: const ValueKey('registerEmployerButton'),
              label: 'İşveren',
              selected: selectedType == _RegisterAccountType.employer,
              onPressed: () => onChanged(_RegisterAccountType.employer),
            ),
          ),
        ],
      ),
    );
  }
}

class _TypeButton extends StatelessWidget {
  const _TypeButton({
    super.key,
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
