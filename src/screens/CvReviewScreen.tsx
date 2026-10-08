import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import {
  AppShell,
  Badge,
  Button,
  Card,
  Chip,
  Dialog,
  Field,
  Label,
  styles,
  Title,
} from "../components/ui";
import { Cv } from "../domain/models";
import { useApp } from "../state/AppProvider";

export default function CvReviewScreen() {
  const { state, dispatch } = useApp();
  const [cv, setCv] = useState<Cv>(() => JSON.parse(JSON.stringify(state.cv)));
  const [skill, setSkill] = useState("");
  const [skillOpen, setSkillOpen] = useState(false);
  const [error, setError] = useState("");
  function update(next: Cv) {
    setCv({ ...next, completed: false });
  }
  function addSkill() {
    const value = skill.trim();
    if (!value) return;
    if (!cv.skills.some((item) => item.toLowerCase() === value.toLowerCase()))
      update({ ...cv, skills: [...cv.skills, value] });
    setSkill("");
    setSkillOpen(false);
  }
  function save() {
    if (
      !cv.summary.trim() ||
      !cv.education.degree.trim() ||
      !cv.education.institution.trim() ||
      cv.experiences.some((item) => !item.role.trim() || !item.company.trim())
    ) {
      setError(
        "Özeti, deneyimlerdeki pozisyon/şirket alanlarını ve eğitim bilgilerini doldurun.",
      );
      return;
    }
    const saved = { ...cv, summary: cv.summary.trim(), completed: true };
    setCv(saved);
    dispatch({ type: "cv", cv: saved });
    setError("");
  }
  async function chooseDocument() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      if ((file.size || 0) > 10 * 1024 * 1024) {
        Alert.alert(
          "Dosya boyutu",
          "En fazla 10 MB boyutunda bir dosya seçin.",
        );
        return;
      }
      update({ ...cv, fileName: file.name });
      Alert.alert(
        "Belge seçildi",
        "Demo modunda belge ayrıştırılmaz veya sunucuya yüklenmez. Aşağıdaki bilgileri elle düzenleyebilirsiniz.",
      );
    } catch {
      Alert.alert("Dosya seçimi", "Belge seçilemedi. Lütfen tekrar deneyin.");
    }
  }
  return (
    <AppShell
      title="Review Parsed Data"
      actions={
        <Button
          label={
            cv.completed ? "Profil Kaydedildi" : "Doğrula ve Profili Kaydet"
          }
          disabled={cv.completed}
          onPress={save}
        />
      }
    >
      <Label muted>
        Verify Candidate Info · Demo CV verilerini doğrulayın ve düzenleyin.
      </Label>
      {cv.completed && <Badge>Profil Kaydedildi</Badge>}
      <Button
        label="CV Yeniden Seç"
        secondary
        onPress={() => void chooseDocument()}
      />
      {!!cv.fileName && <Label muted>Seçilen belge: {cv.fileName}</Label>}
      <Card>
        <Field
          label="Profesyonel Özet"
          value={cv.summary}
          multiline
          onChangeText={(summary) => update({ ...cv, summary })}
        />
      </Card>
      <Card>
        <Title small>Temel Yetenekler</Title>
        <View style={styles.wrap}>
          {cv.skills.map((item) => (
            <Chip
              key={item}
              label={`${item} ×`}
              onPress={() =>
                update({
                  ...cv,
                  skills: cv.skills.filter((value) => value !== item),
                })
              }
            />
          ))}
        </View>
        <Button
          label="Yetenek Ekle"
          secondary
          onPress={() => setSkillOpen(true)}
        />
      </Card>
      <Title small>Deneyim</Title>
      {cv.experiences.map((experience, index) => (
        <Card key={index}>
          {(["role", "company", "period", "description"] as const).map(
            (key) => (
              <Field
                key={key}
                label={
                  {
                    role: "Pozisyon",
                    company: "Şirket",
                    period: "Dönem",
                    description: "Açıklama",
                  }[key]
                }
                value={experience[key]}
                multiline={key === "description"}
                onChangeText={(value) =>
                  update({
                    ...cv,
                    experiences: cv.experiences.map((item, i) =>
                      i === index ? { ...item, [key]: value } : item,
                    ),
                  })
                }
              />
            ),
          )}
        </Card>
      ))}
      <Card>
        <Title small>Eğitim</Title>
        {(["degree", "institution", "period"] as const).map((key) => (
          <Field
            key={key}
            label={
              {
                degree: "Derece",
                institution: "Kurum",
                period: "Eğitim Dönemi",
              }[key]
            }
            value={cv.education[key]}
            onChangeText={(value) =>
              update({ ...cv, education: { ...cv.education, [key]: value } })
            }
          />
        ))}
      </Card>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Dialog
        title="Yetenek Ekle"
        visible={skillOpen}
        onClose={() => setSkillOpen(false)}
      >
        <Field
          label="Yetenek"
          value={skill}
          onChangeText={setSkill}
          onSubmitEditing={addSkill}
        />
        <Button label="Kaydet" onPress={addSkill} />
      </Dialog>
    </AppShell>
  );
}
