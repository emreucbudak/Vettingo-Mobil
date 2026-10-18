import React, { useState } from "react";
import { Text, View } from "react-native";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import {
  Badge,
  Button,
  Card,
  Chip,
  Field,
  Label,
  Section,
  styles,
  Title,
} from "../../../../shared/presentation/components/ui";
import { Cv } from "../../domain/entities/Cv";
import { useApp } from "../../../../core/presentation/state/AppProvider";

export default function CvReviewScreen() {
  const { state, dispatch, services } = useApp();
  const [cv, setCv] = useState<Cv>(() => JSON.parse(JSON.stringify(state.cv)));
  const [skill, setSkill] = useState("");
  const [skillOpen, setSkillOpen] = useState(false);
  const [error, setError] = useState("");
  function update(next: Cv) {
    setCv({ ...next, completed: false });
  }
  function addSkill() {
    const updated = services.workspace.cv.addSkill(cv, skill);
    if (updated !== cv) update(updated);
    setSkill("");
    setSkillOpen(false);
  }
  function save() {
    const validation = services.workspace.cv.validate(cv);
    if (validation) {
      setError(validation);
      return;
    }
    const saved = services.workspace.cv.complete(cv)!;
    setCv(saved);
    dispatch({ type: "cv", cv: saved });
    setError("");
  }
  return (
    <AppShell
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
      {cv.completed && <Badge>Profil Kaydedildi</Badge>}
      {!!cv.fileName && <Label muted>Seçilen belge: {cv.fileName}</Label>}
      <Card>
        <Field
          label="Hedef Rol"
          value={cv.summary}
          onChangeText={(summary) => update({ ...cv, summary })}
        />
      </Card>
      <Card>
        <Section
          title="Temel Yetenekler"
          action="Yetenek Ekle"
          onPress={() => setSkillOpen(true)}
        />
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
        {skillOpen && (
          <Field
            label="Yetenek"
            value={skill}
            onChangeText={setSkill}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={addSkill}
          />
        )}
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
    </AppShell>
  );
}
