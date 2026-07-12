import '../../domain/entities/login_credentials.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_data_source.dart';
import '../models/login_request_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  const AuthRepositoryImpl(this._dataSource);

  final AuthDataSource _dataSource;

  @override
  Future<void> signIn(LoginCredentials credentials) {
    return _dataSource.signIn(LoginRequestModel.fromEntity(credentials));
  }
}
