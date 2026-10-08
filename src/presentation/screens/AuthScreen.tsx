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
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Chip,
  colors,
  Dialog,
  Field,
  Label,
  styles,
  Title,
} from "../components/ui";
import { Role } from "../../domain/entities/models";
import { homeFor } from "../navigation/routes";
import { roleLabels } from "../formatters/labels";
import { useApp } from "../state/AppProvider";
import { legal } from "../content/legal";

export default function AuthScreen({
  register = false,
}: {
  register?: boolean;
}) {
  const { signIn, services } = useApp();
  const [role, setRole] = useState<Role>("candidate");
  const [values, setValues] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    company: "",
    terms: false,
  });
  const [remember, setRemember] = useState(true);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [document, setDocument] = useState<"terms" | "privacy" | null>(null);
  const update = (key: keyof typeof values, value: string | boolean) =>
    setValues((current) => ({ ...current, [key]: value }));
  async function submit() {
    const validation = services.sessions.validate({
      ...values,
      register,
      role,
      remember,
    });
    setErrors(validation);
    if (Object.keys(validation).length || loading) return;
    setLoading(true);
    try {
      await signIn({ ...values, register, role, remember });
      router.replace(homeFor(role) as Href);
    } catch {
      setErrors({ form: "Oturum açılamadı. Lütfen tekrar deneyin." });
    } finally {
      setLoading(false);
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
            source={require("../../../assets/images/vettingo_splash_logo.png")}
            style={{ width: 210, height: 80, alignSelf: "center" }}
            resizeMode="contain"
          />
          <View style={{ gap: 6, marginBottom: 6 }}>
            <Title>
              {register ? "Hesabınızı oluşturun" : "Vettingo’ya hoş geldiniz"}
            </Title>
            <Label muted>
              {register
                ? "Kariyerinizin ve işe alımın bir sonraki adımı."
                : "Kariyerinizi ve işe alım süreçlerinizi yönetin."}
            </Label>
          </View>
          <View style={styles.wrap}>
            {(["candidate", "employer", "hr"] as Role[]).map((item) => (
              <Chip
                key={item}
                label={roleLabels[item]}
                active={role === item}
                onPress={() => setRole(item)}
              />
            ))}
          </View>
          <View
            style={{
              padding: 12,
              backgroundColor: colors.soft,
              borderRadius: 10,
            }}
          >
            <Label muted>
              Demo modu · Giriş ve kayıt yerel olarak çalışır. Gerçek hesap
              doğrulaması ve sunucu bağlantısı henüz yoktur.
            </Label>
          </View>
          {register && (
            <>
              <Field
                label="Ad"
                value={values.name}
                onChangeText={(text) => update("name", text)}
                error={errors.name}
                autoComplete="given-name"
              />
              <Field
                label="Soyad"
                value={values.surname}
                onChangeText={(text) => update("surname", text)}
                error={errors.surname}
                autoComplete="family-name"
              />
            </>
          )}
          <Field
            label="E-posta Adresi"
            value={values.email}
            onChangeText={(text) => update("email", text)}
            placeholder="ornek@vettingo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
          />
          <View style={{ gap: 8 }}>
            <Field
              label="Şifre"
              value={values.password}
              onChangeText={(text) => update("password", text)}
              secureTextEntry={!visible}
              autoCapitalize="none"
              autoComplete={register ? "new-password" : "current-password"}
              error={errors.password}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => setVisible(!visible)}
              style={{ alignSelf: "flex-end", padding: 4 }}
            >
              <Text style={{ color: colors.blue, fontSize: 12 }}>
                {visible ? "Şifreyi gizle" : "Şifreyi göster"}
              </Text>
            </Pressable>
          </View>
          {register && role !== "candidate" && (
            <Field
              label="Şirket Adı"
              value={values.company}
              onChangeText={(text) => update("company", text)}
              error={errors.company}
            />
          )}
          {register ? (
            <>
              <View style={styles.row}>
                <Switch
                  accessibilityLabel="Koşulları kabul ediyorum"
                  value={values.terms}
                  onValueChange={(value) => update("terms", value)}
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
              {errors.terms && <Text style={styles.error}>{errors.terms}</Text>}
            </>
          ) : (
            <View
              style={[
                styles.row,
                { justifyContent: "space-between", flexWrap: "wrap" },
              ]}
            >
              <View style={styles.row}>
                <Switch
                  accessibilityLabel="Beni hatırla"
                  value={remember}
                  onValueChange={setRemember}
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
          {errors.form && (
            <Text accessibilityRole="alert" style={styles.error}>
              {errors.form}
            </Text>
          )}
          <Button
            label={register ? "Kayıt Ol" : "Giriş Yap"}
            onPress={() => void submit()}
            loading={loading}
          />
          {!register && (
            <>
              <Button
                label="LinkedIn ile Giriş Yap"
                secondary
                onPress={() => unavailable("LinkedIn ile giriş")}
              />
              <Button
                label="Google ile Giriş Yap"
                secondary
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
