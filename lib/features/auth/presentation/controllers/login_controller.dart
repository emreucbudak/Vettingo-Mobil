import 'package:flutter/foundation.dart';

import '../../domain/entities/login_credentials.dart';
import '../../domain/usecases/sign_in.dart';

class LoginController extends ChangeNotifier {
  LoginController(this._signIn);

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

  String? validateEmail(String? value) {
    final email = value?.trim() ?? '';
    if (email.isEmpty) return 'Please enter your email address';
    final emailPattern = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');
    if (!emailPattern.hasMatch(email)) return 'Please enter a valid email';
    return null;
  }

  String? validatePassword(String? value) {
    if (value == null || value.isEmpty) return 'Please enter your password';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  }

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
