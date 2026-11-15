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
    id: "stages",
    question: "Adayları süreç aşamasına göre nasıl filtreleyebilirim?",
    answer:
      "Ana Sayfa’daki Adaylar bölümünde Tümünü Gör’e dokunun. Sınav, Mülakat, Teklif ve Reddedildi seçeneklerinden birini seçin. Tüm adayları tekrar görmek için Tümü seçeneğini kullanın.",
  },
  {
    id: "candidate-details",
    question: "Adayın deneyim ve yeteneklerini nereden görebilirim?",
    answer:
      "Aday kartına dokunun. Açılan ekranda Yetenekler, Profesyonel Deneyim, Eğitim, Diller, Sertifikalar ve Projeler bölümlerini görebilirsiniz.",
  },
  {
    id: "interview",
    question: "Bir aday için nasıl mülakat planlayabilirim?",
    answer:
      "Aday Detayı sayfasındaki Mülakat Planla butonuna dokunun. Tarihi YYYY-AA-GG, saati SS:DD biçiminde girip Görüşmeyi Kaydet butonuna basın. Görüşme cihazda saklanır; takvim daveti gönderilmez.",
  },
  {
    id: "missing-interview-result",
    question: "Mülakat sonucunu girmeyi unutursam ne olur?",
    answer:
      "Mülakat sonucunu girmezseniz aday otomatik olarak başarısız sayılır ve adayla olan bağlantınızı kaybedersiniz.",
  },
  {
    id: "comparison",
    question: "Bir ilanın adaylarını nasıl görebilirim?",
    answer:
      "İlanlar sekmesinde ilgili ilan kartına dokunun. O ilana ait adaylar listelenir. Adayın profilini açmak için kartına dokunun.",
  },
  {
    id: "scout",
    question: "Scout ile nasıl yetenek keşfedebilirim?",
    answer:
      "Alt menüdeki Scout sekmesini açın. İsim, pozisyon veya yetenek yazarak arama yapın; ilgilendiğiniz adayın kartına dokunarak profilini inceleyin.",
  },
];

export default function HrHelpScreen() {
  return <HelpPage roleBar="hr" questions={questions} />;
}
