import 'package:form_builder_validators/form_builder_validators.dart';

final class RegisterValidators {
  RegisterValidators._();

  static final _nameValidator = FormBuilderValidators.compose<String>([
    FormBuilderValidators.required(errorText: 'Ad alanı zorunludur.'),
    FormBuilderValidators.minLength(
      2,
      errorText: 'Ad en az 2 karakter olmalıdır.',
    ),
  ]);

  static final _surnameValidator = FormBuilderValidators.compose<String>([
    FormBuilderValidators.required(errorText: 'Soyad alanı zorunludur.'),
    FormBuilderValidators.minLength(
      2,
      errorText: 'Soyad en az 2 karakter olmalıdır.',
    ),
  ]);

  static final _emailValidator = FormBuilderValidators.compose<String>([
    FormBuilderValidators.required(errorText: 'E-posta adresi zorunludur.'),
    FormBuilderValidators.email(errorText: 'Geçerli bir e-posta adresi girin.'),
  ]);

  static final _passwordValidator = FormBuilderValidators.compose<String>([
    FormBuilderValidators.required(errorText: 'Şifre alanı zorunludur.'),
    FormBuilderValidators.minLength(
      6,
      errorText: 'Şifre en az 6 karakter olmalıdır.',
    ),
  ]);

  static final _companyValidator = FormBuilderValidators.compose<String>([
    FormBuilderValidators.required(errorText: 'Şirket adı zorunludur.'),
    FormBuilderValidators.minLength(
      2,
      errorText: 'Şirket adı en az 2 karakter olmalıdır.',
    ),
  ]);

  static final _termsValidator = FormBuilderValidators.equal<bool>(
    true,
    errorText: 'Devam etmek için koşulları kabul edin.',
  );

  static String? name(String? value) => _nameValidator(value?.trim());

  static String? surname(String? value) => _surnameValidator(value?.trim());

  static String? email(String? value) => _emailValidator(value?.trim());

  static String? password(String? value) => _passwordValidator(value);

  static String? company(String? value) => _companyValidator(value?.trim());

  static String? termsAccepted(bool? value) => _termsValidator(value);
}
