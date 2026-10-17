import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { router, Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Chip,
  colors,
  Dialog,
  Label,
  styles,
  Title,
} from "../../../../shared/presentation/components/ui";
import { AuthenticationInput, Role } from "../../domain/entities/Session";
import { authenticationSchema } from "../../domain/policies/validation";
import { AuthField } from "../components/AuthField";
import { homeFor } from "../navigation/routes";
import { roleLabels } from "../formatters/labels";
import { useApp } from "../../../../core/presentation/state/AppProvider";
import { legal } from "../content/legal";

export default function AuthScreen({
  register = false,
  dashboardShortcuts = __DEV__,
}: {
  register?: boolean;
  dashboardShortcuts?: boolean;
}) {
  const { signIn, openTemporaryWorkspace } = useApp();
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AuthenticationInput>({
    resolver: zodResolver(authenticationSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      surname: "",
      company: "",
      terms: false,
      register,
      role: "candidate",
      remember: true,
    },
  });
  const role = useWatch({ control, name: "role" });
  const [visible, setVisible] = useState(false);
  const [document, setDocument] = useState<"terms" | "privacy" | null>(null);
  async function submit(values: AuthenticationInput) {
    clearErrors("root");
    try {
      await signIn(values);
      router.replace(homeFor(values.role) as Href);
    } catch {
      setError("root", {
        type: "server",
        message: "Oturum açılamadı. Lütfen tekrar deneyin.",
      });
    }
  }
  const unavailable = (label: string) =>
    Alert.alert(
      label,
      "Bu özellik backend bağlantısı tamamlandığında kullanıma sunulacak.",
    );
  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            ...styles.content,
            maxWidth: 460,
            paddingTop: 36,
          }}
        >
          <Image
            source={require("../../../../../assets/images/vettingo_splash_logo.png")}
            style={{
              width: 252,
              height: 96,
              maxWidth: "100%",
              alignSelf: "center",
            }}
            resizeMode="contain"
          />
          {register && (
            <View style={{ gap: 6, marginBottom: 6 }}>
              <Title>Hesabınızı oluşturun</Title>
            </View>
          )}
          {register && (
            <Controller
              control={control}
              name="role"
              render={({ field: { value, onChange } }) => (
                <View style={styles.wrap}>
                  {(["candidate", "employer"] as Role[]).map((item) => (
                    <Chip
                      key={item}
                      label={roleLabels[item]}
                      active={value === item}
                      onPress={() => {
                        onChange(item);
                        clearErrors("company");
                      }}
                    />
                  ))}
                </View>
              )}
            />
          )}
          {register && (
            <>
              <AuthField
                control={control}
                name="name"
                label="Ad"
                autoComplete="given-name"
              />
              <AuthField
                control={control}
                name="surname"
                label="Soyad"
                autoComplete="family-name"
              />
            </>
          )}
          <AuthField
            control={control}
            name="email"
            label="E-posta Adresi"
            placeholder="ornek@vettingo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <AuthField
            control={control}
            name="password"
            label="Şifre"
            placeholder={register ? undefined : "Şifrenizi girin"}
            secureTextEntry={!visible}
            autoCapitalize="none"
            autoComplete={register ? "new-password" : "current-password"}
            trailingAccessory={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  visible ? "Şifreyi gizle" : "Şifreyi göster"
                }
                onPress={() => setVisible((current) => !current)}
                style={{
                  minWidth: 44,
                  minHeight: 44,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={visible ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={colors.muted}
                  accessible={false}
                />
              </Pressable>
            }
          />
          {register && role !== "candidate" && (
            <AuthField control={control} name="company" label="Şirket Adı" />
          )}
          {register ? (
            <>
              <View style={styles.row}>
                <Controller
                  control={control}
                  name="terms"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Switch
                      accessibilityLabel="Koşulları kabul ediyorum"
                      value={value ?? false}
                      onValueChange={(next) => {
                        onChange(next);
                        onBlur();
                      }}
                    />
                  )}
                />
                <View style={{ flex: 1, gap: 4 }}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setDocument("terms")}
                  >
                    <Text style={{ color: colors.blue }}>
                      Kullanım koşullarını
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setDocument("privacy")}
                  >
                    <Text style={{ color: colors.blue }}>
                      ve gizlilik politikasını kabul ediyorum.
                    </Text>
                  </Pressable>
                </View>
              </View>
              {errors.terms && (
                <Text accessibilityRole="alert" style={styles.error}>
                  {errors.terms.message}
                </Text>
              )}
            </>
          ) : (
            <View
              style={[
                styles.row,
                { justifyContent: "space-between", flexWrap: "wrap" },
              ]}
            >
              <View style={styles.row}>
                <Controller
                  control={control}
                  name="remember"
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      accessibilityLabel="Beni hatırla"
                      value={value}
                      onValueChange={onChange}
                    />
                  )}
                />
                <Label muted>Beni hatırla</Label>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => unavailable("Şifre sıfırlama")}
              >
                <Text style={{ color: colors.blue, fontSize: 12 }}>
                  Şifrenizi mi unuttunuz?
                </Text>
              </Pressable>
            </View>
          )}
          {errors.root && (
            <Text accessibilityRole="alert" style={styles.error}>
              {errors.root.message}
            </Text>
          )}
          <Button
            label={register ? "Kayıt Ol" : "Giriş Yap"}
            onPress={() => {
              if (__DEV__ && dashboardShortcuts) {
                const destination: Role = !register
                  ? "candidate"
                  : role === "candidate"
                    ? "employer"
                    : "hr";
                openTemporaryWorkspace(destination);
                router.replace("/");
                return;
              }
              void handleSubmit(submit)();
            }}
            loading={isSubmitting}
          />
          {!register && (
            <>
              <Button
                label="LinkedIn ile Giriş Yap"
                secondary
                icon={
                  <Ionicons
                    name="logo-linkedin"
                    size={20}
                    color="#0A66C2"
                    accessible={false}
                  />
                }
                onPress={() => unavailable("LinkedIn ile giriş")}
              />
              <Button
                label="Google ile Giriş Yap"
                secondary
                icon={
                  <Image
                    source={require("../../../../../assets/images/google-logo.png")}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                    accessible={false}
                  />
                }
                onPress={() => unavailable("Google ile giriş")}
              />
            </>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(register ? "/login" : "/register")}
            style={{ padding: 12, alignItems: "center" }}
          >
            <Text style={{ color: colors.blue, fontWeight: "600" }}>
              {register
                ? "Zaten hesabınız var mı? Giriş Yap"
                : "Hesabınız yok mu? Kayıt Olun"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
      <Dialog
        title={document ? legal[document].title : ""}
        visible={!!document}
        onClose={() => setDocument(null)}
      >
        {document &&
          legal[document].paragraphs.map((paragraph, i) => (
            <Label key={i}>{paragraph}</Label>
          ))}
      </Dialog>
    </SafeAreaView>
  );
}
