import React from "react";
import { HelpPage } from "../components/HelpPage";

const questions = [
  {
    id: "create-job",
    question: "Yeni bir iş ilanı nasıl oluşturabilirim?",
    answer:
      "İlanlar sekmesindeki Yeni İlan butonuna dokunun. Pozisyon, departman, çalışma modeli ve yetenekleri belirleyin. İş tanımını ekleyip kontrol adımına geçin ve İlanı Oluştur butonuna basın.",
  },
  {
    id: "search-candidates",
    question: "Adaylar arasında nasıl arama yapabilirim?",
    answer:
      "Adaylar sekmesindeki arama alanına aday adı, pozisyon veya yetenek yazın. Aramanızla eşleşen adaylar listelenir; detaylarını incelemek için aday kartına dokunun.",
  },
  {
    id: "stages",
    question: "Adayları süreç aşamasına göre nasıl filtreleyebilirim?",
    answer:
      "Adaylar sekmesindeki Sınav, Mülakat, Teklif ve Reddedildi seçeneklerinden birine dokunun. Tüm adayları tekrar görmek için Tümü seçeneğini kullanın.",
  },
  {
    id: "candidate-details",
    question: "Adayın deneyim ve yeteneklerini nereden görebilirim?",
    answer:
      "Aday kartına dokunarak Aday Detayı sayfasını açın. Bu sayfada aday özetini, rol uyumunu ve yeteneklerini inceleyebilirsiniz. Profesyonel Deneyim ve Eğitim ve Sertifikalar alanlarını açarak geçmiş bilgilerine ulaşabilirsiniz.",
  },
  {
    id: "interview",
    question: "Bir aday için nasıl mülakat planlayabilirim?",
    answer:
      "Aday Detayı sayfasındaki Mülakat Planla butonuna dokunun. Tarihi YYYY-AA-GG, saati SS:DD biçiminde girip Görüşmeyi Kaydet butonuna basın. Görüşme cihazda saklanır; takvim daveti gönderilmez.",
  },
  {
    id: "advance",
    question: "Adayı işe alım sürecinde nasıl ilerletebilirim?",
    answer:
      "Aday Detayı sayfasında veya Yetenek Karşılaştırma ekranında Adayı İlerlet butonunu kullanın. İşlem sonrasında adayın karar durumu İlerletildi olarak görünür.",
  },
  {
    id: "comparison",
    question: "Bir pozisyonun adaylarını nasıl karşılaştırabilirim?",
    answer:
      "İlanlar sekmesindeki ilgili ilan kartına dokunun. Yetenek Karşılaştırma ekranında aday isimlerini seçerek yetenekleri ve uyum oranlarını inceleyebilir, karşılaştırma özetini görebilirsiniz.",
  },
  {
    id: "scout",
    question: "Scout ile nasıl yetenek keşfedebilirim?",
    answer:
      "Profil menüsündeki Scout seçeneğini açın. İsim, pozisyon veya yetenek yazarak arama yapın; ilgilendiğiniz adayın kartına dokunarak profilini inceleyin.",
  },
];

export default function HrHelpScreen() {
  return <HelpPage questions={questions} />;
}
