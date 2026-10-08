# Vettingo Mobile

Vettingo'nun **React Native + TypeScript** mobil uygulaması. Flutter uygulamasındaki aday, işveren ve İK akışları Expo SDK 57 ile yeniden yazıldı. Android, iOS ve web aynı kaynak kodunu kullanır.

## Çalıştırma

Node.js 22.13 veya üstü gerekir (Node 22 LTS önerilir).

```bash
npm ci
npm start
```

Expo Go'nun SDK 57 ile uyumlu sürümünde QR kodunu açın. Alternatif olarak:

```bash
npm run android
npm run ios
npm run web
```

Android emülatörü için Android SDK; yerel iOS derlemesi için macOS ve Xcode gerekir. Native klasörler Expo tarafından gerektiğinde üretilir:

```bash
npx expo run:android
npx expo run:ios
```

## Mevcut işlevler

- Üç hesap rolü: aday, işveren ve İK. Role göre korunan ekranlar ve ayrı ana sayfalar.
- Giriş/kayıt doğrulaması, şifre görünürlüğü, beni hatırla, koşullar ve gizlilik metinleri.
- Aday başvuruları, durum filtreleri, pazar profili ve önerilen işler.
- İş arama, Remote / Series B+ / Fintech / ücret filtreleri ve tekrarsız yerel başvuru.
- İşveren ve İK ilan/aday listeleri; arama ve başvuru aşaması filtreleri.
- Aday detayı, yetenekler, deneyim/eğitim, özet paylaşımı ve yerel mülakat planlama.
- Üç aday arasında yetenek karşılaştırması; aday bazında ilerletme/reddetme.
- 20 sorulu değerlendirme; kalıcı yanıtlar, süre, soru gezinmesi, bitirme ve yanıt kilidi.
- CV özeti, yetenek, deneyim ve eğitim düzenleme; belge seçimi ve profil kaydetme.
- Üç adımlı ilan oluşturma; koşullu ofis doğrulaması, yetenek seçimi, ücret referansı ve düzenlenebilir açıklama şablonu.
- Hesap ve rol bazında cihazda saklanan profil, kararlar, başvurular, taslaklar ve değerlendirme.
- Özgün Vettingo logo, renk, splash ve Android/iOS uygulama kimlikleri.

## Demo ve backend sınırı

Eski Flutter sürümünde olduğu gibi bu uygulama **yerel demo verileriyle** çalışır. Geçerli biçimde herhangi bir e-posta ve en az altı karakterlik bir şifreyle demo giriş yapılabilir. Kayıt gerçek bir sunucu hesabı oluşturmaz; seçilen role yönlendirir. Şifre saklanmaz. "Beni hatırla" yalnızca demo oturumunu cihazda tutar.

İlanlar ve başvurular sunucuya gönderilmez; aday eşleşmeleri ve özetler örnek verilerdir. Açıklama asistanı yerel bir şablondur. CV dosyası seçilebilir, ancak ayrıştırılmaz ve yüklenmez. Mülakatlar cihazda kaydedilir, davet gönderilmez. Değerlendirme sunucuya gönderilmez veya puanlanmaz. OAuth, şifre sıfırlama, şirket/ekip yönetimi ve push bildirimler backend entegrasyonunu bekler.

Gerçek entegrasyonda kimlik doğrulamayı bir API servisine taşıyın, yetkilendirmeyi sunucuda uygulayın ve gerçek tokenları güvenli depolamada tutun. AsyncStorage'daki mevcut oturum bir **demo kullanıcı tercihi**dir, güvenlik sınırı değildir.

## Clean Architecture

İş kuralları React Native ve Expo'dan bağımsızdır. Ekranlar use case'leri çağırır; use case'ler domain içindeki repository ve cihaz servisi arayüzlerine bağımlıdır. Somut uygulamalar `composition/createAppServices.ts` içinde bağlanır. Katman sınırları ESLint ile kontrol edilir.

```text
src/
  app/             Expo Router yolları ve rol korumaları
  domain/          Entity'ler, saf iş kuralları, repository ve port arayüzleri
  application/     Giriş, arama, başvuru, CV, aday, ilan ve değerlendirme use case'leri
  data/            Demo verisi, kayıt mapper'ı ve yerel repository uygulamaları
  infrastructure/  Saat, Expo belge seçimi ve React Native paylaşım adaptörleri
  presentation/    Ekranlar, bileşenler, UI state, etiketler ve gezinme
  composition/     Constructor injection ile bağımlılıkların bağlandığı nokta
tests/          İş kuralları, ekran etkileşimleri ve kayıt testleri
assets/images/  Özgün Vettingo görselleri
```

Akış ve backend entegrasyon noktaları: [Mimari belgesi](docs/ARCHITECTURE.md). Yerel kayıt anahtarları ve veri sürümü korunmuştur.

## Kontroller

```bash
npm run typecheck
npm run lint
npm test -- --runInBand
npx expo install --check
npx expo-doctor
npx expo export --platform all
```

GitHub Actions TypeScript, lint, test ve web paketleme kontrollerini her push/PR için çalıştırır.

## APK ve mağaza derlemeleri

`eas.json` geliştirme, önizleme APK ve üretim profillerini içerir. Kendi Expo hesabınız ve imzalama yapılandırmanızla:

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest build --platform ios --profile production
```

Geliştirme profili kullanılacaksa önce `npx expo install expo-dev-client` çalıştırın. Mağaza gönderimi için hesap, imzalama ve EAS proje bağlantısı ayrıca yapılandırılmalıdır. Depoda gerçek imzalama anahtarı veya API anahtarı bulunmaz.

## Flutter arşivi

Flutter kaynakları aktif projeden ayrılmıştır. Geçiş sırasında yerel kaynak kopyası ve tüm Git geçmişini içeren `.bundle` yedeği alınmıştır. Yeni GitHub deposu yalnızca React Native kaynaklarını içerir.

İlgili projeler: [Backend](https://github.com/emreucbudak/Vettingo), [Web frontend](https://github.com/emreucbudak/Vettingo-Frontend).

Teknik kaynaklar: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/), [Expo Router](https://docs.expo.dev/router/introduction/), [React Native](https://reactnative.dev/docs/getting-started).
