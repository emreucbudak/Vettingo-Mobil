import React, { useState } from "react";
import { Text, View } from "react-native";
import { router, Href } from "expo-router";
import {
  AppShell,
  Badge,
  Button,
  Card,
  Chip,
  Field,
  Label,
  styles,
  Title,
} from "../components/ui";
import { Requisition } from "../../domain/entities/models";
import { useApp } from "../state/AppProvider";

export default function RequisitionScreen() {
  const { state, session, dispatch, services } = useApp();
  const catalog = services.queries.catalog.filters;
  const [draft, setDraft] = useState<Requisition>(
    () => state.draft || services.workspace.requisitions.create(),
  );
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  function update(next: Requisition) {
    setDraft(next);
    setMessage("");
  }
  function saveDraft() {
    dispatch({ type: "draft", draft });
    setMessage("Taslak cihazda kaydedildi.");
  }
  function next() {
    const error = services.workspace.requisitions.validate(draft);
    if (error) {
      setMessage(error);
      return;
    }
    dispatch({ type: "draft", draft });
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
  function autoDraft() {
    update(services.workspace.requisitions.generateDescription(draft));
  }
  return (
    <AppShell
      title="New Requisition"
      actions={
        <View style={{ gap: 10 }}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Button label="Taslağı Kaydet" secondary onPress={saveDraft} />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                label={step === 2 ? "İlanı Oluştur" : "Devam Et"}
                onPress={step === 2 ? publish : next}
              />
            </View>
          </View>
          {step > 0 && (
            <Button
              label="Önceki Adım"
              secondary
              onPress={() => setStep(step - 1)}
            />
          )}
        </View>
      }
    >
      <View style={styles.wrap}>
        {["Role Definition", "Job Description", "Review"].map(
          (label, index) => (
            <Chip
              key={label}
              label={`${index + 1}. ${label}`}
              active={step === index}
            />
          ),
        )}
      </View>
      {step === 0 && (
        <>
          <Card>
            <Title small>Role Definition</Title>
            <Field
              label="Pozisyon Adı"
              value={draft.title}
              onChangeText={(title) => update({ ...draft, title })}
              placeholder="Senior Backend Engineer"
            />
            <Label>Departman</Label>
            <View style={styles.wrap}>
              {catalog.departments.map((department) => (
                <Chip
                  key={department}
                  label={department}
                  active={draft.department === department}
                  onPress={() => update({ ...draft, department })}
                />
              ))}
            </View>
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
            <Title small>Önerilen Yetenekler</Title>
            <View style={styles.wrap}>
              {catalog.skills.map((skill) => (
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
          <Title small>Job Description</Title>
          <Label muted>
            Demo asistanı düzenlenebilir bir metin şablonu oluşturur.
          </Label>
          <Button label="Taslak Oluştur" secondary onPress={autoDraft} />
          <Field
            label="İş Tanımı"
            multiline
            value={draft.description}
            onChangeText={(description) => update({ ...draft, description })}
          />
        </Card>
      )}
      {step === 2 && (
        <Card>
          <Title small>{draft.title}</Title>
          <Label>{draft.department}</Label>
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
        <Text
          accessibilityRole="alert"
          style={message.includes("kaydedildi") ? styles.muted : styles.error}
        >
          {message}
        </Text>
      )}
    </AppShell>
  );
}
