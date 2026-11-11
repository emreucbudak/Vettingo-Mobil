import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import {
  Badge,
  Button,
  Card,
  Chip,
  colors,
  Field,
  Label,
  Section,
  styles,
  Title,
} from "../../../../shared/presentation/components/ui";
import { Cv, CvCertification } from "../../domain/entities/Cv";
import { useApp } from "../../../../core/presentation/state/AppProvider";

const certificationTypes = ["Mesleki", "Eğitim", "Diğer"];

export default function CvReviewScreen() {
  const { state, dispatch, services } = useApp();
  const [cv, setCv] = useState<Cv>(() => JSON.parse(JSON.stringify(state.cv)));
  const [skill, setSkill] = useState("");
  const [skillOpen, setSkillOpen] = useState(false);
  const [certificationDraft, setCertificationDraft] =
    useState<CvCertification | null>(null);
  const [certificationTypesOpen, setCertificationTypesOpen] = useState(false);
  const [error, setError] = useState("");
  const certifications = cv.certifications ?? [];
  const certificationName = certificationDraft?.name.trim();
  const certificationType = certificationDraft?.type;
  const cvWithCertification =
    certificationName && certificationType
      ? {
          ...cv,
          certifications: [
            ...certifications,
            { name: certificationName, type: certificationType },
          ],
        }
      : cv;
  function update(next: Cv) {
    setCv({ ...next, completed: false });
  }
  function addSkill() {
    const updated = services.workspace.cv.addSkill(cv, skill);
    if (updated !== cv) update(updated);
    setSkill("");
    setSkillOpen(false);
  }
  function closeCertificationForm() {
    setCertificationDraft(null);
    setCertificationTypesOpen(false);
  }
  function save() {
    if (
      cvWithCertification === cv &&
      (certificationName || certificationType)
    ) {
      setError("Sertifika adını yazın ve türünü seçin.");
      return;
    }
    const validation = services.workspace.cv.validate(cvWithCertification);
    if (validation) {
      setError(validation);
      return;
    }
    const saved = services.workspace.cv.complete(cvWithCertification)!;
    setCv(saved);
    dispatch({ type: "cv", cv: saved });
    closeCertificationForm();
    setError("");
  }
  return (
    <AppShell>
      {cv.completed && <Badge>Profil Kaydedildi</Badge>}
      {!!cv.fileName && <Label muted>Seçilen belge: {cv.fileName}</Label>}
      <Card>
        <Field
          label="Hedef Rol"
          value={cv.summary}
          onChangeText={(summary) => update({ ...cv, summary })}
        />
      </Card>
      <Section
        title="Temel Yetenekler"
        action="Yetenek Ekle"
        onPress={() => setSkillOpen(true)}
      />
      <Card>
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
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <Title small>Deneyim</Title>
        <Text
          style={{
            color: colors.blue,
            fontWeight: "600",
            fontSize: 12,
            padding: 8,
          }}
        >
          Deneyim Ekle
        </Text>
      </View>
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
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <Title small>Eğitim</Title>
        <Text
          style={{
            color: colors.blue,
            fontWeight: "600",
            fontSize: 12,
            padding: 8,
          }}
        >
          Eğitim Ekle
        </Text>
      </View>
      <Card>
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
      <Section
        title="Sertifikalar"
        action={certificationDraft ? "Vazgeç" : "Sertifika Ekle"}
        onPress={() => {
          setError("");
          if (certificationDraft) closeCertificationForm();
          else setCertificationDraft({ name: "", type: "" });
        }}
      />
      {certifications.length > 0 && (
        <Card>
          {certifications.map(({ name, type }, index) => (
            <View key={index}>
              <Label>{name}</Label>
              <Label muted>{type}</Label>
            </View>
          ))}
        </Card>
      )}
      {certificationDraft && (
        <Card>
          <Field
            label="Sertifika Adı"
            value={certificationDraft.name}
            onChangeText={(name) =>
              setCertificationDraft({ ...certificationDraft, name })
            }
          />
          <View style={{ gap: 6 }}>
            <Text style={styles.label}>Sertifika Türü</Text>
            <Pressable
              accessibilityRole="combobox"
              accessibilityLabel="Sertifika Türü"
              accessibilityState={{ expanded: certificationTypesOpen }}
              accessibilityValue={{ text: certificationType || "Tür seçin" }}
              onPress={() => setCertificationTypesOpen((open) => !open)}
              style={[
                styles.input,
                styles.row,
                { justifyContent: "space-between" },
              ]}
            >
              <Label muted={!certificationType}>
                {certificationType || "Tür seçin"}
              </Label>
              <Ionicons
                name={certificationTypesOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.muted}
                accessible={false}
              />
            </Pressable>
            {certificationTypesOpen &&
              certificationTypes.map((type) => (
                <Pressable
                  key={type}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: certificationType === type }}
                  onPress={() => {
                    setCertificationDraft({ ...certificationDraft, type });
                    setCertificationTypesOpen(false);
                  }}
                  style={[
                    styles.input,
                    certificationType === type && {
                      backgroundColor: colors.soft,
                    },
                  ]}
                >
                  <Label>{type}</Label>
                </Pressable>
              ))}
          </View>
          <Button
            label="Ekle"
            secondary
            disabled={cvWithCertification === cv}
            onPress={() => {
              update(cvWithCertification);
              closeCertificationForm();
              setError("");
            }}
          />
        </Card>
      )}
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button
        label="CV’yi Kaydet"
        disabled={cv.completed && cvWithCertification === cv}
        onPress={save}
      />
    </AppShell>
  );
}
