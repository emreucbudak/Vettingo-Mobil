import React from "react";
import { HelpPage } from "../components/HelpPage";

const questions = [
  {
    id: "create-job",
    question: "Şirketim için nasıl yeni bir ilan oluşturabilirim?",
    answer:
      "İlanlar sekmesindeki Yeni İlan butonuna dokunun. Pozisyon adını, departmanı, çalışma modelini ve aranan yetenekleri belirleyin. İş tanımını ekleyip kontrol adımında İlanı Oluştur butonuna basın.",
  },
  {
    id: "work-model",
    question: "İlanın çalışma modelini nasıl belirleyebilirim?",
    answer:
      "Yeni ilan oluştururken Çalışma Modeli bölümünden Remote, Hybrid veya On-site seçeneğini belirleyin. Hybrid veya On-site seçtiğinizde Ofis bölümünden çalışma yerini de seçebilirsiniz.",
  },
  {
    id: "compensation",
    question: "İlana pazar maaş aralığını nasıl ekleyebilirim?",
    answer:
      "İlan oluşturma formundaki Market Compensation bölümünde Pazar Aralığını Uygula butonuna dokunun. Seçilen aralık kontrol adımında görünür. Tercihi kaldırmak için aynı butona tekrar dokunabilirsiniz.",
  },
  {
    id: "jobs",
    question: "İlanlarımı ve aday sayılarını nereden takip edebilirim?",
    answer:
      "İlanlar sekmesinde pozisyonlarınızı listeleyebilirsiniz. İlan kartlarında çalışma modeli, süreç durumu, tecrübe, maaş ve istenen yetenekler bulunur. Ana Sayfa üzerindeki Aktif İlanlar bölümünden de ilanlarınıza ulaşabilirsiniz.",
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
    question: "Scout üzerinden nasıl yeni yetenekler bulabilirim?",
    answer:
      "Alt menüdeki Scout sekmesine dokunun. İsim, pozisyon veya yetenek bilgisiyle arama yapabilir, sonuçlardaki aday kartlarını açarak şirketiniz için uygun profilleri inceleyebilirsiniz.",
  },
];

export default function EmployerHelpScreen() {
  return <HelpPage roleBar="employer" questions={questions} />;
}
