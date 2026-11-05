import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { router, Href } from "expo-router";
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
import { Requisition } from "../../domain/entities/Requisition";
import { useApp } from "../../../../core/presentation/state/AppProvider";

export default function RequisitionScreen() {
  const { session, dispatch, services } = useApp();
  const catalog = services.requisitionCatalog.catalog;
  const [draft, setDraft] = useState<Requisition>(() =>
    services.workspace.requisitions.create(),
  );
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const [skill, setSkill] = useState("");
  const [skillOpen, setSkillOpen] = useState(false);
  const [skillOptions, setSkillOptions] = useState(() => [...catalog.skills]);
  function update(next: Requisition) {
    setDraft(next);
    setMessage("");
  }
  function next() {
    const error = services.workspace.requisitions.validate(draft);
    if (error) {
      setMessage(error);
      return;
    }
    setStep(step + 1);
    setMessage("");
  }
  function publish() {
    const error = services.workspace.requisitions.validatePublication(draft);
    if (error) {
      setMessage(error);
      return;
    }
    dispatch({
      type: "publish",
      requisition: draft,
    });
    router.replace(`/${session!.role}-jobs` as Href);
  }
  function addSkill() {
    const value = skill.trim();
    if (!value) return;
    const existing = skillOptions.find(
      (item) => item.toLowerCase() === value.toLowerCase(),
    );
    const selected = existing ?? value;
    if (!existing) setSkillOptions([...skillOptions, selected]);
    if (!draft.skills.includes(selected)) {
      update({ ...draft, skills: [...draft.skills, selected] });
    }
    setSkill("");
    setSkillOpen(false);
  }
  return (
    <AppShell>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {["Role Definition", "Job Description", "İş İlan Akışı", "Review"].map(
          (label, index) => (
            <View
              key={label}
              style={{
                flex: 1,
                minWidth: 0,
                minHeight: 48,
                borderRadius: 999,
                backgroundColor: step === index ? colors.primary : colors.soft,
                paddingHorizontal: 4,
                paddingVertical: 9,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: step === index ? "#fff" : colors.muted,
                  fontSize: 12,
                  lineHeight: 16,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {label}
              </Text>
            </View>
          ),
        )}
      </View>
      {step === 0 && (
        <>
          <Card>
            <Field
              label="Pozisyon Adı"
              value={draft.title}
              onChangeText={(title) => update({ ...draft, title })}
              placeholder="Senior Backend Engineer"
            />
            <Label>Çalışma Modeli</Label>
            <View style={styles.wrap}>
              {(["remote", "hybrid", "onsite"] as const).map((locationType) => (
                <Chip
                  key={locationType}
                  label={
                    { remote: "Remote", hybrid: "Hybrid", onsite: "On-site" }[
                      locationType
                    ]
                  }
                  active={draft.locationType === locationType}
                  onPress={() =>
                    update({
                      ...draft,
                      locationType,
                      office: locationType === "remote" ? "" : draft.office,
                    })
                  }
                />
              ))}
            </View>
            {draft.locationType !== "remote" && (
              <>
                <Label>Ofis</Label>
                <View style={styles.wrap}>
                  {catalog.offices.map((office) => (
                    <Chip
                      key={office}
                      label={office}
                      active={draft.office === office}
                      onPress={() => update({ ...draft, office })}
                    />
                  ))}
                </View>
              </>
            )}
          </Card>
          <Card>
            <Section
              title="Yetenekler"
              action="Yetenek Ekle"
              onPress={() => setSkillOpen(true)}
            />
            <View style={styles.wrap}>
              {skillOptions.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  active={draft.skills.includes(skill)}
                  onPress={() =>
                    update({
                      ...draft,
                      skills: draft.skills.includes(skill)
                        ? draft.skills.filter((item) => item !== skill)
                        : [...draft.skills, skill],
                    })
                  }
                />
              ))}
            </View>
            {skillOpen && (
              <View style={{ gap: 10 }}>
                <Field
                  label="Yetenek"
                  placeholder="Yetenek adı"
                  value={skill}
                  onChangeText={setSkill}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={addSkill}
                />
                <Button
                  label="Ekle"
                  disabled={!skill.trim()}
                  onPress={addSkill}
                />
                <Button
                  label="Vazgeç"
                  secondary
                  onPress={() => {
                    setSkill("");
                    setSkillOpen(false);
                  }}
                />
              </View>
            )}
          </Card>
          <Card>
            <Title small>Market Compensation</Title>
            <Label>$150k - $190k · US Remote</Label>
            <Label muted>P25: $135k · Median: $165k · P75: $200k</Label>
            <Button
              label={
                draft.marketCompensation
                  ? "Pazar Aralığı Uygulandı"
                  : "Pazar Aralığını Uygula"
              }
              secondary
              onPress={() =>
                update({
                  ...draft,
                  marketCompensation: !draft.marketCompensation,
                })
              }
            />
          </Card>
        </>
      )}
      {step === 1 && (
        <Card>
          <TextInput
            accessibilityLabel="İş Tanımı"
            multiline
            value={draft.description}
            onChangeText={(description) => update({ ...draft, description })}
            underlineColorAndroid="transparent"
            style={[
              styles.text,
              { minHeight: 220, textAlignVertical: "top", padding: 0 },
            ]}
          />
        </Card>
      )}
      {step === 2 && (
        <Card>
          <Title small>İş İlan Akışı</Title>
        </Card>
      )}
      {step === 3 && (
        <Card>
          <Title small>{draft.title}</Title>
          {!!draft.department && <Label>{draft.department}</Label>}
          <Label muted>
            {draft.locationType} {draft.office}
          </Label>
          <View style={styles.wrap}>
            {draft.skills.map((skill) => (
              <Chip key={skill} label={skill} />
            ))}
          </View>
          {draft.marketCompensation && <Badge>$150k - $190k</Badge>}
          <Label>
            {draft.description || "İş tanımı eklenmedi. Önceki adıma dönün."}
          </Label>
          <Label muted>
            İlan bu cihazdaki demo listesine eklenir. GitHub veya backend
            üzerinden yayımlanmaz.
          </Label>
        </Card>
      )}
      {!!message && (
        <Text accessibilityRole="alert" style={styles.error}>
          {message}
        </Text>
      )}
      <View style={{ gap: 10 }}>
        <Button
          label={
            step === 3
              ? "İlanı Oluştur"
              : step === 2
                ? "Sonraki adıma geç"
                : "Devam Et"
          }
          onPress={step === 3 ? publish : next}
        />
        {step > 0 && step !== 2 && (
          <Button
            label="Önceki Adım"
            secondary
            onPress={() => setStep(step - 1)}
          />
        )}
      </View>
    </AppShell>
  );
}
