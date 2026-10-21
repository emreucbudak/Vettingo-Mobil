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
      "İlanlar sekmesinde pozisyonlarınızı listeleyebilirsiniz. İlan kartlarında çalışma modeli, süreç durumu ve aday bilgisi bulunur. Ana Sayfa üzerindeki Aktif Pozisyonlar bölümünden de ilanlarınıza ulaşabilirsiniz.",
  },
  {
    id: "candidates",
    question: "Adayları nasıl bulup inceleyebilirim?",
    answer:
      "Adaylar sekmesindeki arama alanını ve aşama filtrelerini kullanın. Bir aday kartına dokunarak adayın özetini, rol uyumunu, yeteneklerini, deneyimini ve eğitim bilgilerini inceleyebilirsiniz.",
  },
  {
    id: "comparison",
    question: "Bir pozisyon için adayları nasıl karşılaştırabilirim?",
    answer:
      "İlgili ilan kartına dokunarak Yetenek Karşılaştırma ekranını açın. Aday isimleri arasında geçiş yaparak uyum oranlarını ve yetenekleri inceleyin. Karşılaştırma Özeti bölümünde adayların uyum ve karar durumlarını birlikte görebilirsiniz.",
  },
  {
    id: "decisions",
    question: "Bir aday için nasıl ilerletme veya ret kararı verebilirim?",
    answer:
      "Yetenek Karşılaştırma ekranında ilgili adayı seçin. Adayı İlerlet veya Adayı Reddet butonuna dokunun. Verdiğiniz karar adayın durum bilgisinde ve karşılaştırma özetinde görünür.",
  },
  {
    id: "scout",
    question: "Scout üzerinden nasıl yeni yetenekler bulabilirim?",
    answer:
      "Profil menüsünden Scout seçeneğine dokunun. İsim, pozisyon veya yetenek bilgisiyle arama yapabilir, sonuçlardaki aday kartlarını açarak şirketiniz için uygun profilleri inceleyebilirsiniz.",
  },
];

export default function EmployerHelpScreen() {
  return <HelpPage questions={questions} />;
}
