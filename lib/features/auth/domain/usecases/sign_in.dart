import '../entities/login_credentials.dart';
import '../repositories/auth_repository.dart';

class SignIn {
  const SignIn(this._repository);

  final AuthRepository _repository;

  Future<void> call(LoginCredentials credentials) {
    return _repository.signIn(credentials);
  }
}
