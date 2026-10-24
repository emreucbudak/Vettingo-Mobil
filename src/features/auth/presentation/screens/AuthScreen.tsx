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
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  colors,
  Dialog,
  Label,
  styles,
} from "../../../../shared/presentation/components/ui";
import { AuthenticationInput, Role } from "../../domain/entities/Session";
import { authenticationSchema } from "../../domain/policies/validation";
import { AuthField } from "../components/AuthField";
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
  const { beginAuthentication } = useApp();
  const {
    control,
    handleSubmit,
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
  const codeRoute = register ? "/verify-email" : "/verify-login-code";
  function submit(values: AuthenticationInput) {
    beginAuthentication(values);
    router.push(codeRoute);
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
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.content,
            { maxWidth: 460 },
            register
              ? { paddingTop: 36 }
              : {
                  flexGrow: 1,
                  justifyContent: "center",
                  paddingTop: 24,
                  paddingBottom: 24,
                },
          ]}
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
            <Controller
              control={control}
              name="role"
              render={({ field: { value, onChange } }) => (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 0,
                    width: "100%",
                    maxWidth: 380,
                    alignSelf: "center",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    overflow: "hidden",
                  }}
                >
                  {(["candidate", "employer"] as Role[]).map((item) => (
                    <Pressable
                      key={item}
                      accessibilityRole="button"
                      accessibilityLabel={roleLabels[item]}
                      accessibilityState={{ selected: value === item }}
                      onPress={() => {
                        onChange(item);
                        clearErrors("company");
                      }}
                      style={({ pressed }) => ({
                        flex: 1,
                        minHeight: 48,
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: value === item ? "#000" : "#fff",
                        opacity: pressed ? 0.8 : 1,
                      })}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "700",
                          textAlign: "center",
                          color: value === item ? "#fff" : colors.ink,
                        }}
                      >
                        {roleLabels[item]}
                      </Text>
                    </Pressable>
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
                placeholder="Adınızı girin"
                autoComplete="given-name"
              />
              <AuthField
                control={control}
                name="surname"
                label="Soyad"
                placeholder="Soyadınızı girin"
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
            placeholder={register ? "Şifrenizi oluşturun" : "Şifrenizi girin"}
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
            <AuthField
              control={control}
              name="company"
              label="Şirket Adı"
              placeholder="Şirket adını girin"
            />
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
                onPress={() => router.push("/forgot-password")}
              >
                <Text style={{ color: colors.blue, fontSize: 12 }}>
                  Şifrenizi mi unuttunuz?
                </Text>
              </Pressable>
            </View>
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
                beginAuthentication({ register, previewRole: destination });
                router.push(codeRoute);
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
