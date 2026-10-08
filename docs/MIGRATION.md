# Flutter → React Native geçişi

Kaynak: `emreucbudak/Vettingo-Mobil`, Flutter `master` commit'i `e86b1b68dd4ccab6f73e1e8fac12aec996108f96`.

Geçiş tarihi: 8 Ekim 2026.

## Ekran kapsamı

| Flutter ekranı                             | React Native yolu                        |
| ------------------------------------------ | ---------------------------------------- |
| DashboardLoginPage / DashboardRegisterPage | `/login`, `/register`                    |
| CandidateDashboardPage                     | `/candidate-dashboard`                   |
| CandidateApplicationsPage                  | `/candidate-applications`                |
| JobSearchPage                              | `/job-search`                            |
| CandidateAssessmentPage                    | `/candidate-assessment`                  |
| CvReviewPage                               | `/cv-review`                             |
| EmployerDashboardPage / HrDashboardPage    | `/employer-dashboard`, `/hr-dashboard`   |
| EmployerJobsPage / HrJobsPage              | `/employer-jobs`, `/hr-jobs`             |
| EmployerCandidatesPage / HrCandidatesPage  | `/employer-candidates`, `/hr-candidates` |
| EmployerProfilePage / HrProfilePage        | `/employer-profile`, `/hr-profile`       |
| CandidateDetailPage                        | `/candidate-detail?id=...`               |
| TalentComparisonPage                       | `/talent-comparison`                     |
| NewRequisitionPage                         | `/new-requisition`                       |
| Aday profil menüsü                         | `/candidate-profile`                     |

Aktif Flutter uygulamasında kullanılmayan eski landing/login view parçaları yeni uygulamaya alınmadı. Yeni uygulama da giriş ekranından başlar.

## Davranış değişiklikleri

- Kayıt seçilen rolün ana sayfasına gider. Eski kayıt ekranındaki bütün hesapları İK'ya yönlendirme kaldırıldı.
- Liste kartları seçilen adayın kimliğini detay ekranına taşır. Her kartın aynı Sarah Jenkins detayını açması kaldırıldı.
- Yerel kararlar, başvurular, CV ve taslaklar hesap/rol bazında AsyncStorage'da saklanır. Demo şifreleri kaydedilmez.
- Değerlendirme sayacı gerçek bir son tarih kullanır ve ekran yeniden açıldığında kaldığı süreden devam eder. Değerlendirme sorularındaki Flutter/Dart örnekleri React Native/TypeScript karşılıklarıyla güncellendi.
- İlan akışı düzenlenebilir açıklama, inceleme ve yerel ilan listesine ekleme adımlarıyla tamamlandı.

## Doğrulama

- TypeScript ve lint kontrolleri geçti.
- Jest: 2 suite, 24 test geçti. Kapsam: rol/form doğrulaması, arama/filtreler, tekrarsız başvuru, aday kararları, CV, ilan taslağı ve yayın, süreli değerlendirme, hesaplar arası kayıt izolasyonu.
- Expo Doctor: 21/21 kontrol geçti. Expo bağımlılık sürümleri uyumlu.
- Android, iOS ve web JavaScript paketleri üretildi.
- Tarayıcıda 390×844 telefon görünümünde aday girişi/arama/profil/çıkış, İK girişi, doğru aday detayına gezinme ve aday ilerletme kontrol edildi. [Ekran görüntüsü](screenshots/candidate-detail.jpg).
- Gerçek telefon/emülatör testi, imzalı APK/IPA derlemesi ve backend entegrasyonu bu doğrulamaya dahil değildir.

## Bağımlılık denetimi

`npm audit`, 8 Ekim 2026'da Expo 57/Jest 29 bağımlılık ağında 16 orta ve 49 yüksek uyarı bildirdi. Kök nedenler arasında braces, node-forge, decode-uri-component, sprintf-js ve uuid bulunuyor. Kontrol sırasında braces, node-forge ve sprintf-js için npm'deki son sürümler de bildirilen aralık içindeydi. Expo veya React Native'i eski/uyumsuz sürümlere indiren `audit fix --force` önerileri uygulanmadı. SDK uyumlu upstream düzeltmeler takip edilmelidir. Bu durum uygulamanın çalıştırma testleriyle giderilmiş sayılmaz.

## Yerel yedek

Aktif proje `Vettingo-Mobil/vettingomobil` altında React Native olarak devam eder.

Eski Flutter çalışma klasörü ve tam Git geçmişi yedeği `Vettingo-Mobil/.migration-backups/2026-10-08/` altındadır. Bu yedek yeni GitHub projesine eklenmez.

Git geçmişi geri yüklenebilir:

```bash
git clone vettingo-flutter-history-2026-10-08.bundle flutter-history
```
