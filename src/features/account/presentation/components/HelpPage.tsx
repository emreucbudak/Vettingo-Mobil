import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppShell } from "../../../../core/presentation/layout/AppShell";
import { colors } from "../../../../shared/presentation/components/ui";

export interface HelpQuestion {
  id: string;
  question: string;
  answer: string;
}

export function HelpPage({
  questions,
}: {
  questions: readonly HelpQuestion[];
}) {
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
