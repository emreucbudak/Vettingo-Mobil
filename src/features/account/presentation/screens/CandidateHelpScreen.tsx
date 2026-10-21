import React from "react";
import { HelpPage } from "../components/HelpPage";

const questions = [
  {
    id: "cv",
    question: "CV bilgilerimi nasıl düzenleyebilirim?",
    answer:
      "Profil sekmesindeki CV seçeneğine dokunun. Hedef rol, yetenek, deneyim ve eğitim bilgilerinizi düzenledikten sonra CV’yi Kaydet butonuna basın.",
  },
  {
    id: "search",
    question: "İş ilanlarını nasıl arayabilirim?",
    answer:
      "Alt menüdeki Arama sekmesine gidin. Arama alanına pozisyon veya şirket adını yazarak ilgili ilanları görüntüleyebilirsiniz.",
  },
  {
    id: "filters",
    question: "İlanları nasıl filtreleyebilirim?",
    answer:
      "Arama alanının yanındaki filtre ikonuna dokunun. Çalışma tercihi, maaş ve deneyim seçeneklerini kullanarak sonuçları daraltabilirsiniz. Seçili filtreyi kaldırmak için ilgili etikete dokunun.",
  },
  {
    id: "apply",
    question: "Bir iş ilanına nasıl başvurabilirim?",
    answer:
      "Ana Sayfa veya Arama sekmesindeki ilan kartında yer alan Başvur butonuna dokunun. Başvuru eklendiğinde buton Başvuru Gönderildi olarak değişir; başvurunuzu Başvurularım sekmesinde görebilirsiniz.",
  },
  {
    id: "applications",
    question: "Başvurularımın durumunu nereden takip edebilirim?",
    answer:
      "Başvurularım sekmesinde başvurularınızı ve süreçteki sonraki adımı görebilirsiniz. Tümü, Başvuruldu, Mülakat ve Olumsuz filtreleriyle başvurularınızı durumlarına göre listeleyebilirsiniz.",
  },
  {
    id: "assessment",
    question: "Teknik değerlendirmeye nasıl katılabilirim?",
    answer:
      "Mülakat aşamasındaki başvurunuzun kartında Teknik Değerlendirmeye Git butonuna dokunun. Değerlendirmede kalan süreyi takip edebilir, Önceki ve Sonraki butonlarıyla sorular arasında geçiş yapabilirsiniz. Tamamladıktan sonra yanıtlarınızı değiştiremezsiniz.",
  },
  {
    id: "notifications",
    question: "Bildirim tercihimi nasıl değiştirebilirim?",
    answer:
      "Profil sekmesindeki Bildirim Tercihi anahtarını kullanarak tercihinizi açabilir veya kapatabilirsiniz.",
  },
  {
    id: "logout",
    question: "Hesabımdan nasıl çıkış yapabilirim?",
    answer:
      "Profil sekmesinin altındaki Çıkış Yap seçeneğine dokunun. Oturumunuz kapatıldığında giriş ekranına yönlendirilirsiniz.",
  },
];

export default function CandidateHelpScreen() {
  return <HelpPage questions={questions} />;
}
