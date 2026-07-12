enum AccountType { jobSeeker, employer }

class LoginCredentials {
  const LoginCredentials({
    this.email = '',
    this.password = '',
    this.rememberMe = false,
    this.accountType = AccountType.jobSeeker,
  });

  final String email;
  final String password;
  final bool rememberMe;
  final AccountType accountType;

  LoginCredentials copyWith({
    String? email,
    String? password,
    bool? rememberMe,
    AccountType? accountType,
  }) {
    return LoginCredentials(
      email: email ?? this.email,
      password: password ?? this.password,
      rememberMe: rememberMe ?? this.rememberMe,
      accountType: accountType ?? this.accountType,
    );
  }
}
