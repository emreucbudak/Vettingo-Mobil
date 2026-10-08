import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import {
  AppShell,
  Badge,
  Button,
  Card,
  Chip,
  colors,
  Dialog,
  Label,
  Progress,
  styles,
  Title,
} from "../components/ui";
import { useApp } from "../state/AppProvider";

export default function AssessmentScreen() {
  const { state, dispatch, services } = useApp();
  const { questions } = services.queries.catalog;
  const assessment = state.assessment;
  const [now, setNow] = useState(() => services.workspace.assessment.now());
  const [finishOpen, setFinishOpen] = useState(false);
  useEffect(() => {
    dispatch({ type: "start-assessment" });
  }, [dispatch]); // Remounts resume the stored deadline.
  useEffect(() => {
    if (assessment.finished) return;
    const timer = setInterval(
      () => setNow(services.workspace.assessment.now()),
      1000,
    );
    return () => clearInterval(timer);
  }, [assessment.finished, services]);
  const remaining = services.workspace.assessment.remainingSeconds(state, now);
  useEffect(() => {
    if (assessment.deadline && remaining === 0 && !assessment.finished)
      dispatch({ type: "finish-assessment" });
  }, [remaining, assessment.deadline, assessment.finished, dispatch]);
  const question = questions[assessment.currentIndex];
  const answered = questions.filter(
    (item) => assessment.answers[item.id],
  ).length;
  const clock = `${Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0")}:${(remaining % 60).toString().padStart(2, "0")}`;
  return (
    <AppShell
      title="Technical Assessment"
      actions={
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Button
              label="Önceki"
              secondary
              disabled={assessment.currentIndex === 0}
              onPress={() =>
                dispatch({
                  type: "question",
                  index: assessment.currentIndex - 1,
                })
              }
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              label={
                assessment.currentIndex === questions.length - 1
                  ? "Tamamla"
                  : "Sonraki"
              }
              disabled={
                assessment.finished &&
                assessment.currentIndex === questions.length - 1
              }
              onPress={() =>
                assessment.currentIndex === questions.length - 1
                  ? setFinishOpen(true)
                  : dispatch({
                      type: "question",
                      index: assessment.currentIndex + 1,
                    })
              }
            />
          </View>
        </View>
      }
    >
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <Label>
          Soru {assessment.currentIndex + 1} / {questions.length}
        </Label>
        <Badge success={remaining > 120}>
          {assessment.finished ? "Tamamlandı" : clock}
        </Badge>
      </View>
      <Progress value={answered / questions.length} />
      <Label muted>
        {answered} / {questions.length} soru yanıtlandı
      </Label>
      <View style={styles.wrap}>
        {questions.map((item, index) => (
          <Chip
            key={item.id}
            label={`${assessment.answers[item.id] ? "✓ " : ""}${index + 1}`}
            active={index === assessment.currentIndex}
            onPress={() => dispatch({ type: "question", index })}
          />
        ))}
      </View>
      {assessment.finished && (
        <Card>
          <Title small>Değerlendirme tamamlandı</Title>
          <Label>
            Yanıtların cihazda kaydedildi. Demo modunda sunucuya gönderim ve
            puanlama yapılmaz.
          </Label>
        </Card>
      )}
      <Card>
        <Badge success={false}>
          {question.category} · {question.difficulty}
        </Badge>
        <Title small>{question.prompt}</Title>
        <View
          style={{
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 12,
            gap: 10,
          }}
        >
          <Text style={{ color: "#95A8C7", fontSize: 11 }}>
            {question.fileName}
          </Text>
          <Text
            selectable
            style={{
              color: "#E5EEFF",
              fontFamily: "monospace",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            {question.code}
          </Text>
        </View>
        {question.options.map((option, index) => {
          const selected = assessment.answers[question.id] === option.id;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityState={{
                checked: selected,
                disabled: assessment.finished,
              }}
              accessibilityLabel={option.text}
              disabled={assessment.finished}
              onPress={() =>
                dispatch({
                  type: "answer",
                  questionId: question.id,
                  optionId: option.id,
                })
              }
              style={{
                backgroundColor: selected ? colors.soft : "#fff",
                borderColor: selected ? colors.blue : colors.border,
                borderWidth: 1,
                borderRadius: 12,
                padding: 14,
                flexDirection: "row",
                gap: 12,
              }}
            >
              <Text
                style={{
                  color: selected ? colors.blue : colors.muted,
                  fontWeight: "700",
                }}
              >
                {String.fromCharCode(65 + index)}
              </Text>
              <View style={{ flex: 1 }}>
                <Label>{option.text}</Label>
              </View>
            </Pressable>
          );
        })}
      </Card>
      {!assessment.finished && (
        <Button
          label="Değerlendirmeyi Bitir"
          secondary
          onPress={() => setFinishOpen(true)}
        />
      )}
      <Dialog
        title="Değerlendirmeyi Bitir"
        visible={finishOpen}
        onClose={() => setFinishOpen(false)}
      >
        <Label>
          {questions.length - answered} soru yanıtsız. Tamamladıktan sonra
          yanıtları değiştiremezsiniz.
        </Label>
        <Button
          label="Yanıtları Kaydet ve Bitir"
          onPress={() => {
            dispatch({ type: "finish-assessment" });
            setFinishOpen(false);
          }}
        />
      </Dialog>
    </AppShell>
  );
}
