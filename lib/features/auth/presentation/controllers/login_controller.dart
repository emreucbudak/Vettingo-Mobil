import 'package:flutter/foundation.dart';
import 'package:form_builder_validators/form_builder_validators.dart';

import '../../domain/entities/login_credentials.dart';
import '../../domain/usecases/sign_in.dart';

class LoginController extends ChangeNotifier {
  LoginController(this._signIn);

  static final _emailValidator = FormBuilderValidators.compose<String>([
    FormBuilderValidators.required(
      errorText: 'Please enter your email address',
    ),
    FormBuilderValidators.email(errorText: 'Please enter a valid email'),
  ]);
  static final _passwordValidator = FormBuilderValidators.compose<String>([
    FormBuilderValidators.required(errorText: 'Please enter your password'),
    FormBuilderValidators.minLength(
      6,
      errorText: 'Password must be at least 6 characters',
    ),
  ]);

  final SignIn _signIn;
  LoginCredentials _credentials = const LoginCredentials();
  bool _isPasswordVisible = false;
  bool _isLoading = false;

  LoginCredentials get credentials => _credentials;
  bool get isPasswordVisible => _isPasswordVisible;
  bool get isLoading => _isLoading;

  void setEmail(String value) {
    _credentials = _credentials.copyWith(email: value.trim());
  }

  void setPassword(String value) {
    _credentials = _credentials.copyWith(password: value);
  }

  void selectAccountType(AccountType value) {
    if (_credentials.accountType == value) return;
    _credentials = _credentials.copyWith(accountType: value);
    notifyListeners();
  }

  void setRememberMe(bool value) {
    _credentials = _credentials.copyWith(rememberMe: value);
    notifyListeners();
  }

  void togglePasswordVisibility() {
    _isPasswordVisible = !_isPasswordVisible;
    notifyListeners();
  }

  String? validateEmail(String? value) => _emailValidator(value?.trim());

  String? validatePassword(String? value) => _passwordValidator(value);

  Future<void> signIn() async {
    if (_isLoading) return;
    _isLoading = true;
    notifyListeners();
    try {
      await _signIn(_credentials);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
