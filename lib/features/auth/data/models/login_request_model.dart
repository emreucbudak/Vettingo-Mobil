import '../../domain/entities/login_credentials.dart';

class LoginRequestModel {
  const LoginRequestModel({
    required this.email,
    required this.password,
    required this.rememberMe,
    required this.accountType,
  });

  factory LoginRequestModel.fromEntity(LoginCredentials credentials) {
    return LoginRequestModel(
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe,
      accountType: credentials.accountType.name,
    );
  }

  final String email;
  final String password;
  final bool rememberMe;
  final String accountType;

  Map<String, Object> toJson() => {
    'email': email,
    'password': password,
    'rememberMe': rememberMe,
    'accountType': accountType,
  };
}
