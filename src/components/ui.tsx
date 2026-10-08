import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Href, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../state/AppProvider";
import { homeFor } from "../domain/workflows";

export const colors = {
  primary: "#091426",
  ink: "#0B1C30",
  muted: "#545F73",
  bg: "#F8F9FF",
  blue: "#3982B4",
  border: "#DCE3EF",
  soft: "#EFF4FF",
  green: "#087F5B",
  greenBg: "#DCFCE7",
  red: "#B42318",
  redBg: "#FEE4E2",
};
export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 18,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  title: {
    color: colors.ink,
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  heading: { color: colors.ink, fontSize: 19, fontWeight: "700" },
  text: { color: colors.ink, fontSize: 15, lineHeight: 23 },
  muted: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  input: {
    color: colors.ink,
    backgroundColor: "#FFFFFF",
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 50,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  label: { color: colors.ink, fontWeight: "600", fontSize: 13 },
  error: { color: colors.red, fontSize: 13, lineHeight: 20 },
});
export function Label({
  children,
  muted = false,
}: React.PropsWithChildren<{ muted?: boolean }>) {
  return <Text style={muted ? styles.muted : styles.text}>{children}</Text>;
}
export function Title({
  children,
  small = false,
}: React.PropsWithChildren<{ small?: boolean }>) {
  return (
    <Text
      accessibilityRole="header"
      style={small ? styles.heading : styles.title}
    >
      {children}
    </Text>
  );
}
export function Card({ children }: React.PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}
export function Button({
  label,
  onPress,
  secondary = false,
  danger = false,
  disabled = false,
  loading = false,
  testID,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 48,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: secondary
          ? colors.soft
          : danger
            ? colors.red
            : colors.primary,
        opacity: disabled || loading ? 0.45 : pressed ? 0.75 : 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
      })}
    >
      {loading && (
        <ActivityIndicator color={secondary ? colors.primary : "#fff"} />
      )}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "700",
          color: secondary ? colors.primary : "#fff",
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
export function Chip({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  const body = (
    <Text
      style={{
        color: active ? "#fff" : colors.muted,
        fontSize: 12,
        fontWeight: "600",
      }}
    >
      {label}
    </Text>
  );
  const style = {
    borderRadius: 999,
    backgroundColor: active ? colors.primary : colors.soft,
    paddingHorizontal: 12,
    paddingVertical: 9,
  };
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={style}
    >
      {body}
    </Pressable>
  ) : (
    <View style={style}>{body}</View>
  );
}
export function Badge({
  children,
  success = true,
}: React.PropsWithChildren<{ success?: boolean }>) {
  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor: success ? colors.greenBg : colors.soft,
        borderRadius: 7,
        paddingHorizontal: 9,
        paddingVertical: 5,
      }}
    >
      <Text
        style={{
          color: success ? colors.green : colors.muted,
          fontWeight: "700",
          fontSize: 11,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
export function Field({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#8791A1"
        {...props}
        style={[
          styles.input,
          props.multiline && { minHeight: 110, textAlignVertical: "top" },
          props.style,
        ]}
      />
      {!!error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}
export function Search({
  value,
  onChangeText,
  placeholder,
  onFilter,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onFilter?: () => void;
}) {
  return (
    <View style={[styles.row, styles.input, { paddingVertical: 0 }]}>
      <Ionicons name="search-outline" size={20} color={colors.muted} />
      <TextInput
        accessibilityLabel={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8791A1"
        style={{ flex: 1, minHeight: 48, color: colors.ink }}
      />
      {value.length > 0 && (
        <Pressable
          accessibilityLabel="Aramayı temizle"
          accessibilityRole="button"
          onPress={() => onChangeText("")}
          style={{ padding: 8 }}
        >
          <Ionicons name="close-outline" size={22} color={colors.muted} />
        </Pressable>
      )}
      {onFilter && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filtreler"
          onPress={onFilter}
          style={{ padding: 8 }}
        >
          <Ionicons name="options-outline" size={22} color={colors.primary} />
        </Pressable>
      )}
    </View>
  );
}
export function Progress({ value }: { value: number }) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={{
        height: 6,
        backgroundColor: colors.soft,
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: 6,
          width: `${Math.max(0, Math.min(1, value)) * 100}%`,
          backgroundColor: colors.blue,
          borderRadius: 10,
        }}
      />
    </View>
  );
}
export function Avatar({ initials }: { initials: string }) {
  return (
    <View
      style={{
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: colors.soft,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "800", color: colors.blue }}>
        {initials}
      </Text>
    </View>
  );
}
export function Section({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={[styles.row, { justifyContent: "space-between" }]}>
      <View style={{ flex: 1 }}>
        <Title small>{title}</Title>
      </View>
      {action && (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={{ padding: 8 }}
        >
          <Text style={{ color: colors.blue, fontWeight: "600", fontSize: 12 }}>
            {action}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
export function Empty({
  label = "Aramanızla eşleşen sonuç bulunamadı.",
}: {
  label?: string;
}) {
  return (
    <View style={{ padding: 32, gap: 12, alignItems: "center" }}>
      <Ionicons name="search-outline" size={32} color={colors.muted} />
      <Label muted>{label}</Label>
    </View>
  );
}
export function Dialog({
  title,
  visible,
  onClose,
  children,
}: React.PropsWithChildren<{
  title: string;
  visible: boolean;
  onClose: () => void;
}>) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          flex: 1,
          backgroundColor: "#09142688",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          accessibilityViewIsModal
          style={{
            width: "100%",
            maxWidth: 520,
            alignSelf: "center",
            maxHeight: "90%",
            backgroundColor: colors.bg,
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <View style={{ padding: 20, gap: 14 }}>
            <Section title={title} action="Kapat" onPress={onClose} />
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 16 }}
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
export function Loading() {
  return (
    <SafeAreaView
      style={[
        styles.page,
        { justifyContent: "center", alignItems: "center", gap: 14 },
      ]}
    >
      <ActivityIndicator color={colors.blue} />
      <Label muted>Vettingo yükleniyor…</Label>
    </SafeAreaView>
  );
}
export function AppShell({
  children,
  title,
  actions,
}: React.PropsWithChildren<{ title?: string; actions?: React.ReactNode }>) {
  const { session, storageError } = useApp();
  const path = usePathname();
  if (!session) return <Loading />;
  const role = session.role;
  const tabs: {
    label: string;
    path: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] =
    role === "candidate"
      ? [
          {
            label: "Ana Sayfa",
            path: "/candidate-dashboard",
            icon: "home-outline",
          },
          {
            label: "Başvurularım",
            path: "/candidate-applications",
            icon: "briefcase-outline",
          },
          { label: "Arama", path: "/job-search", icon: "search-outline" },
          {
            label: "Profil",
            path: "/candidate-profile",
            icon: "person-circle-outline",
          },
        ]
      : [
          {
            label: "Ana Sayfa",
            path: `/${role}-dashboard`,
            icon: "home-outline",
          },
          {
            label: "İlanlar",
            path: `/${role}-jobs`,
            icon: "briefcase-outline",
          },
          {
            label: "Adaylar",
            path: `/${role}-candidates`,
            icon: "people-outline",
          },
          {
            label: "Profil",
            path: `/${role}-profile`,
            icon: "person-circle-outline",
          },
        ];
  const main = tabs.some((tab) => tab.path === path);
  return (
    <SafeAreaView style={styles.page} edges={["top", "bottom"]}>
      <View
        style={{
          height: 60,
          alignItems: "center",
          justifyContent: "center",
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text
          style={{
            fontSize: 23,
            fontWeight: "800",
            color: colors.primary,
            letterSpacing: -0.8,
          }}
        >
          Vettingo<Text style={{ color: colors.blue }}>.</Text>
        </Text>
        {!main && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={() =>
              router.canGoBack()
                ? router.back()
                : router.replace(homeFor(role) as Href)
            }
            style={{ position: "absolute", left: 14, padding: 10 }}
          >
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
          </Pressable>
        )}
      </View>
      {!!storageError && (
        <Text accessibilityRole="alert" style={[styles.error, { padding: 12 }]}>
          {storageError}
        </Text>
      )}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          {!!title && <Title>{title}</Title>}
          {children}
        </ScrollView>
        {actions && (
          <View
            style={{
              padding: 16,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              backgroundColor: "#fff",
              gap: 10,
            }}
          >
            {actions}
          </View>
        )}
      </KeyboardAvoidingView>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 10,
          paddingBottom: 8,
        }}
      >
        {tabs.map((tab) => {
          const active =
            path === tab.path ||
            (tab.label === "Profil" && path === "/cv-review");
          return (
            <Pressable
              key={tab.path}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: active }}
              onPress={() => router.replace(tab.path as Href)}
              style={{ flex: 1, alignItems: "center", gap: 4, minHeight: 46 }}
            >
              <Ionicons
                name={tab.icon}
                size={23}
                color={active ? colors.blue : colors.muted}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: active ? "700" : "500",
                  color: active ? colors.blue : colors.muted,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
