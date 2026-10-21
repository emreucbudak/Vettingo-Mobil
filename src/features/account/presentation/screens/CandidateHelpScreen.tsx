import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { colors } from "../../../../shared/presentation/components/ui";

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
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <AppShell>
      {questions.map((item) => {
        const expanded = openId === item.id;

        return (
          <View key={item.id} style={helpStyles.box}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.question}
              accessibilityState={{ expanded }}
              onPress={() =>
                setOpenId((current) => (current === item.id ? null : item.id))
              }
              style={({ pressed }) => [
                helpStyles.questionRow,
                pressed && helpStyles.pressed,
              ]}
            >
              <Text style={helpStyles.question}>{item.question}</Text>
              <Ionicons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={20}
                color={colors.muted}
                accessible={false}
              />
            </Pressable>
            {expanded && (
              <View style={helpStyles.answerSection}>
                <Text style={helpStyles.answer}>{item.answer}</Text>
              </View>
            )}
          </View>
        );
      })}
    </AppShell>
  );
}

const helpStyles = StyleSheet.create({
  box: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    overflow: "hidden",
  },
  questionRow: {
    minHeight: 74,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  pressed: { backgroundColor: colors.soft },
  question: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "600",
  },
  answerSection: {
    marginHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  answer: { color: colors.muted, fontSize: 14, lineHeight: 22 },
});
