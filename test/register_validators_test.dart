import 'package:flutter_test/flutter_test.dart';
import 'package:vettingomobil/features/auth/presentation/validators/register_validators.dart';

void main() {
  test('register validators reject invalid values and accept valid values', () {
    expect(RegisterValidators.name(null), 'Ad alanı zorunludur.');
    expect(RegisterValidators.name('A'), 'Ad en az 2 karakter olmalıdır.');
    expect(RegisterValidators.name(' Ada '), isNull);

    expect(RegisterValidators.surname(''), 'Soyad alanı zorunludur.');
    expect(
      RegisterValidators.surname('K'),
      'Soyad en az 2 karakter olmalıdır.',
    );
    expect(RegisterValidators.surname(' Kaya '), isNull);

    expect(RegisterValidators.email(''), 'E-posta adresi zorunludur.');
    expect(
      RegisterValidators.email('geçersiz-email'),
      'Geçerli bir e-posta adresi girin.',
    );
    expect(RegisterValidators.email(' aday@example.com '), isNull);

    expect(RegisterValidators.password(null), 'Şifre alanı zorunludur.');
    expect(
      RegisterValidators.password('123'),
      'Şifre en az 6 karakter olmalıdır.',
    );
    expect(RegisterValidators.password('password123'), isNull);

    expect(RegisterValidators.company(''), 'Şirket adı zorunludur.');
    expect(
      RegisterValidators.company('A'),
      'Şirket adı en az 2 karakter olmalıdır.',
    );
    expect(RegisterValidators.company(' Acme '), isNull);

    expect(
      RegisterValidators.termsAccepted(false),
      'Devam etmek için koşulları kabul edin.',
    );
    expect(RegisterValidators.termsAccepted(true), isNull);
  });
}
