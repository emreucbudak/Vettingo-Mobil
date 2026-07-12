import '../models/login_request_model.dart';

abstract interface class AuthDataSource {
  Future<void> signIn(LoginRequestModel request);
}

class FakeAuthDataSource implements AuthDataSource {
  const FakeAuthDataSource();

  @override
  Future<void> signIn(LoginRequestModel request) async {
    // This is the data boundary. Replace it with an API client when available.
    await Future<void>.delayed(const Duration(milliseconds: 600));
  }
}
