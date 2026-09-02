import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../hr/presentation/pages/hr_dashboard_page.dart';
import '../validators/register_validators.dart';

enum _RegisterAccountType { jobSeeker, employer }

enum _LegalDocument { terms, privacy }

class _LegalContent {
  const _LegalContent({required this.title, required this.paragraphs});

  final String title;
  final List<String> paragraphs;
}

const _legalDocuments = <_LegalDocument, _LegalContent>{
  _LegalDocument.terms: _LegalContent(
    title: 'Kullanım Koşulları',
    paragraphs: [
      'Vettingo hesabınızı oluşturduğunuzda platformu işe alım, aday değerlendirme ve kariyer süreçlerini yönetmek amacıyla kullanmayı kabul etmiş olursunuz. Hesap bilgilerinizin doğru, güncel ve size ait olması gerekir; yanlış veya başka bir kişiye ait bilgilerle hesap açılması durumunda ilgili hesabın erişimi sınırlandırılabilir.',
      'Platform içinde paylaşılan ilan, başvuru, özgeçmiş, değerlendirme notu ve benzeri içeriklerden ilgili kullanıcı sorumludur. Yanıltıcı bilgi, izinsiz veri paylaşımı, üçüncü kişilerin haklarını ihlal eden içerik veya sistemi kötüye kullanmaya yönelik işlem yapılmamalıdır.',
      'İşveren hesapları, aday verilerini yalnızca açık işe alım süreçleri ve meşru değerlendirme amaçları için kullanmalıdır. Adaylarla ilgili bilgiler kurum dışına aktarılırken ilgili kişinin mahremiyetine, yürürlükteki mevzuata ve şirket içi yetkilendirme kurallarına uygun hareket edilmelidir.',
      'Aday hesapları, başvuru sırasında paylaştıkları belgelerin ve açıklamaların güncel olmasına özen göstermelidir. Başvuru süreçlerinde kullanılan değerlendirme sonuçları tek başına kesin işe alım kararı anlamına gelmez; nihai karar ilgili işverenin kendi süreçleri kapsamında verilir.',
      'Vettingo, hizmetin güvenliğini ve sürekliliğini korumak için teknik bakım, güvenlik kontrolleri ve gerekli ürün güncellemeleri yapabilir. Bu çalışmalar sırasında kısa süreli erişim kısıtları oluşabilir; planlı bakım durumlarında kullanıcıların makul şekilde bilgilendirilmesi hedeflenir.',
      'Hizmetleri kullanmaya devam etmeniz, yürürlükteki koşulları kabul ettiğiniz anlamına gelir. Koşullarda esaslı bir değişiklik olursa kullanıcıların bunu makul şekilde fark edebileceği kanallardan bilgilendirme yapılır.',
    ],
  ),
  _LegalDocument.privacy: _LegalContent(
    title: 'Gizlilik Politikası',
    paragraphs: [
      'Vettingo, hesabınızı oluşturmak, başvurularınızı yönetmek, işveren ve aday deneyimini iyileştirmek ve güvenli oturum sağlamak için ad, soyad, e-posta, hesap türü ve platform kullanım bilgileri gibi verileri işler.',
      'Özgeçmiş, başvuru geçmişi, değerlendirme notları ve yetenek eşleştirme çıktıları yalnızca ilgili işe alım süreçleri kapsamında kullanılır. Bu bilgiler, yetkisiz kişilerle satılmaz veya bağımsız ticari amaçlarla paylaşılmaz.',
      'Platformda yapılan işlemler, hizmet kalitesini korumak, hataları gidermek, güvenlik olaylarını araştırmak ve kullanıcı desteği sağlamak amacıyla kayıt altına alınabilir. Bu kayıtlar ihtiyaçla sınırlı şekilde tutulur ve erişim yetkileri kontrollü biçimde yönetilir.',
      'Verileriniz, hizmet sağlayıcılarımızın teknik altyapısı üzerinde güvenlik önlemleriyle saklanabilir. Erişim yetkileri sınırlı tutulur ve kayıtlar yalnızca işin gerektirdiği kişiler tarafından görüntülenebilir.',
      'Çerezler ve benzeri teknolojiler; oturumunuzu açık tutmak, tercihlerinizi hatırlamak ve platformun nasıl kullanıldığını anlamak için kullanılabilir. Zorunlu olmayan izleme tercihleri için tarayıcı ayarlarınızdan veya sunulan tercih araçlarından seçim yapabilirsiniz.',
      'Hesap bilgilerinizin düzeltilmesini, silinmesini veya işleme amaçları hakkında bilgi verilmesini talep edebilirsiniz. Bu talepler, kimlik doğrulaması yapıldıktan sonra makul süre içinde değerlendirilir.',
    ],
  ),
};

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

  Future<void> _showLegalDocument(_LegalDocument document) async {
    await showDialog<void>(
      context: context,
      builder: (context) =>
          _LegalDocumentDialog(content: _legalDocuments[document]!),
    );
  }

  void _submit() {
    FocusScope.of(context).unfocus();
    if (!(_formKey.currentState?.validate() ?? false)) return;
    Navigator.of(context).pushReplacementNamed(HrDashboardPage.routeName);
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
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _RegisterField(
                          fieldKey: const ValueKey('registerNameField'),
                          label: 'Ad',
                          hint: 'Adınız',
                          icon: Icons.person_outline_rounded,
                          textInputAction: TextInputAction.next,
                          autofillHints: const [AutofillHints.givenName],
                          validator: RegisterValidators.name,
                        ),
                        const SizedBox(height: 16),
                        _RegisterField(
                          fieldKey: const ValueKey('registerSurnameField'),
                          label: 'Soyad',
                          hint: 'Soyadınız',
                          icon: Icons.account_box_outlined,
                          textInputAction: TextInputAction.next,
                          autofillHints: const [AutofillHints.familyName],
                          validator: RegisterValidators.surname,
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
                          validator: RegisterValidators.email,
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
                          validator: RegisterValidators.password,
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
                            validator: RegisterValidators.company,
                            onFieldSubmitted: (_) => _submit(),
                          ),
                        ],
                        const SizedBox(height: 18),
                        FormField<bool>(
                          key: const ValueKey('registerTermsField'),
                          initialValue: _termsAccepted,
                          autovalidateMode: AutovalidateMode.onUserInteraction,
                          validator: RegisterValidators.termsAccepted,
                          builder: (field) => Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  SizedBox(
                                    width: 24,
                                    height: 24,
                                    child: Checkbox(
                                      key: const ValueKey(
                                        'registerTermsCheckbox',
                                      ),
                                      value: field.value ?? false,
                                      activeColor: AppColors.primary,
                                      side: const BorderSide(
                                        color: AppColors.outline,
                                      ),
                                      onChanged: (value) {
                                        final accepted = value ?? false;
                                        setState(
                                          () => _termsAccepted = accepted,
                                        );
                                        field.didChange(accepted);
                                      },
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Wrap(
                                      crossAxisAlignment:
                                          WrapCrossAlignment.center,
                                      children: [
                                        _LegalLinkButton(
                                          key: const ValueKey(
                                            'registerTermsLink',
                                          ),
                                          label: 'Kullanım koşullarını',
                                          onPressed: () => _showLegalDocument(
                                            _LegalDocument.terms,
                                          ),
                                        ),
                                        const Text(
                                          ' ve ',
                                          style: _legalTextStyle,
                                        ),
                                        _LegalLinkButton(
                                          key: const ValueKey(
                                            'registerPrivacyLink',
                                          ),
                                          label: 'gizlilik politikasını',
                                          onPressed: () => _showLegalDocument(
                                            _LegalDocument.privacy,
                                          ),
                                        ),
                                        const Text(
                                          ' kabul ediyorum.',
                                          style: _legalTextStyle,
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              if (field.hasError)
                                Padding(
                                  padding: const EdgeInsets.only(
                                    left: 34,
                                    top: 6,
                                  ),
                                  child: Text(
                                    field.errorText!,
                                    style: TextStyle(
                                      color: Theme.of(
                                        context,
                                      ).colorScheme.error,
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
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

const _legalTextStyle = TextStyle(
  color: AppColors.onSurfaceVariant,
  fontSize: 12,
  height: 1.4,
);

class _LegalLinkButton extends StatelessWidget {
  const _LegalLinkButton({
    super.key,
    required this.label,
    required this.onPressed,
  });

  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        foregroundColor: const Color(0xFF2563EB),
        padding: const EdgeInsets.symmetric(vertical: 2),
        minimumSize: Size.zero,
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
        textStyle: const TextStyle(
          fontSize: 12,
          height: 1.4,
          fontWeight: FontWeight.w600,
          decoration: TextDecoration.underline,
        ),
      ),
      child: Text(label),
    );
  }
}

class _LegalDocumentDialog extends StatefulWidget {
  const _LegalDocumentDialog({required this.content});

  final _LegalContent content;

  @override
  State<_LegalDocumentDialog> createState() => _LegalDocumentDialogState();
}

class _LegalDocumentDialogState extends State<_LegalDocumentDialog> {
  final _scrollController = ScrollController();

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.sizeOf(context).height;

    return Dialog(
      key: const ValueKey('registerLegalDialog'),
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: 520,
          maxHeight: screenHeight * .8,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 14, 8, 12),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      widget.content.title,
                      style: const TextStyle(
                        color: AppColors.primary,
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  IconButton(
                    key: const ValueKey('registerLegalCloseButton'),
                    tooltip: 'Kapat',
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.close_rounded),
                  ),
                ],
              ),
            ),
            const Divider(height: 1, color: AppColors.outlineVariant),
            Flexible(
              child: Scrollbar(
                controller: _scrollController,
                thumbVisibility: true,
                child: SingleChildScrollView(
                  key: const ValueKey('registerLegalScroll'),
                  controller: _scrollController,
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      for (
                        var index = 0;
                        index < widget.content.paragraphs.length;
                        index++
                      ) ...[
                        Text(
                          widget.content.paragraphs[index],
                          style: const TextStyle(
                            color: AppColors.onSurfaceVariant,
                            fontSize: 14,
                            height: 1.55,
                          ),
                        ),
                        if (index < widget.content.paragraphs.length - 1)
                          const SizedBox(height: 16),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ],
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
    this.keyboardType,
    this.textInputAction,
    this.autofillHints,
    this.obscureText = false,
    this.suffixIcon,
    this.onFieldSubmitted,
    required this.validator,
  });

  final Key fieldKey;
  final String label;
  final String hint;
  final IconData icon;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final Iterable<String>? autofillHints;
  final bool obscureText;
  final Widget? suffixIcon;
  final ValueChanged<String>? onFieldSubmitted;
  final FormFieldValidator<String> validator;

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
          onFieldSubmitted: onFieldSubmitted,
          validator: validator,
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
