import React, { useState } from "react";
import {
  act,
  fireEvent,
  renderAsync,
  waitFor,
} from "@testing-library/react-native";
import { createAppServices } from "../src/composition/createAppServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import AuthScreen from "../src/features/auth/presentation/screens/AuthScreen";
import { CandidatesScreen } from "../src/features/candidates/presentation/screens/CandidatesScreen";
import { JobSearchScreen } from "../src/features/jobs/presentation/screens/JobSearchScreen";
import RequisitionScreen from "../src/features/requisitions/presentation/screens/RequisitionScreen";
import CvReviewScreen from "../src/features/cv/presentation/screens/CvReviewScreen";
import ComparisonScreen from "../src/features/candidates/presentation/screens/ComparisonScreen";
import AssessmentScreen from "../src/features/assessment/presentation/screens/AssessmentScreen";
import {
  AppProvider as InjectedAppProvider,
  useApp,
} from "../src/core/presentation/state/AppProvider";

function AppProvider({ children }: React.PropsWithChildren) {
  const [services] = useState(createAppServices);
  return (
    <InjectedAppProvider services={services}>{children}</InjectedAppProvider>
  );
}
const session = {
  email: "test@vettingo.com",
  name: "Alex",
  role: "candidate",
  company: "",
  remember: true,
};
async function renderApp(
  element: React.ReactElement,
  services?: ReturnType<typeof createAppServices>,
) {
  const view = await renderAsync(
    services ? (
      <InjectedAppProvider services={services}>{element}</InjectedAppProvider>
    ) : (
      <AppProvider>{element}</AppProvider>
    ),
  );
  await waitFor(() =>
    expect(view.queryByText("Vettingo yükleniyor…")).toBeNull(),
  );
  return view;
}
beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});
async function signedIn(element: React.ReactElement, role = "candidate") {
  await AsyncStorage.setItem(
    "vettingo:demo-session:v1",
    JSON.stringify({ ...session, role }),
  );
  return renderApp(element);
}
test("login reports errors without showing account role buttons", async () => {
  const view = await renderApp(<AuthScreen />);
  fireEvent.press(view.getByRole("button", { name: "Giriş Yap" }));
  await waitFor(() =>
    expect(view.getByText("Geçerli bir e-posta adresi girin.")).toBeTruthy(),
  );
  expect(view.getByText("Şifre en az 6 karakter olmalıdır.")).toBeTruthy();
  for (const role of ["İş Arayan", "İşveren", "İK"])
    expect(view.queryByRole("button", { name: role })).toBeNull();
  fireEvent.changeText(view.getByLabelText("Şifre"), "secret");
  await waitFor(() =>
    expect(view.queryByText("Şifre en az 6 karakter olmalıdır.")).toBeNull(),
  );
  expect(view.getByLabelText("Şifre").props.secureTextEntry).toBe(true);
  fireEvent.press(view.getByRole("button", { name: "Şifreyi göster" }));
  expect(view.getByLabelText("Şifre").props.secureTextEntry).toBe(false);
  expect(view.getByLabelText("Şifre").props.value).toBe("secret");
  fireEvent.press(view.getByRole("button", { name: "Şifreyi gizle" }));
  expect(view.getByLabelText("Şifre").props.secureTextEntry).toBe(true);
  expect(view.queryByText("Şifreyi göster")).toBeNull();
  // The first async native mount also initializes the React Native mocks.
}, 15000);
test("registration shows company field only for hiring roles and enforces consent", async () => {
  const view = await renderApp(<AuthScreen register />);
  expect(view.queryByRole("button", { name: "İK" })).toBeNull();
  expect(view.queryByLabelText("Şirket Adı")).toBeNull();
  fireEvent.press(view.getByRole("button", { name: "İşveren" }));
  expect(view.getByLabelText("Şirket Adı")).toBeTruthy();
  fireEvent.press(view.getByRole("button", { name: "Kayıt Ol" }));
  await waitFor(() =>
    expect(
      view.getByText("Devam etmek için koşulları kabul edin."),
    ).toBeTruthy(),
  );
  expect(view.getByText("Şirket adı en az 2 karakter olmalıdır.")).toBeTruthy();
  fireEvent.press(view.getByRole("button", { name: "İş Arayan" }));
  expect(view.queryByLabelText("Şirket Adı")).toBeNull();
  expect(view.queryByText("Şirket adı en az 2 karakter olmalıdır.")).toBeNull();
});

test("login submits RHF values and respects the remember switch", async () => {
  const services = createAppServices();
  const signIn = jest.spyOn(services.sessions, "signIn");
  const view = await renderApp(<AuthScreen />, services);
  fireEvent.changeText(
    view.getByLabelText("E-posta Adresi"),
    "alex@vettingo.com",
  );
  fireEvent.changeText(view.getByLabelText("Şifre"), "secret");
  fireEvent(view.getByLabelText("Beni hatırla"), "valueChange", false);
  fireEvent.press(view.getByRole("button", { name: "Giriş Yap" }));
  await waitFor(() =>
    expect(router.replace).toHaveBeenCalledWith("/candidate-dashboard"),
  );
  expect(signIn).toHaveBeenCalledWith(
    expect.objectContaining({
      email: "alex@vettingo.com",
      password: "secret",
      remember: false,
      register: false,
    }),
  );
  expect(await AsyncStorage.getItem("vettingo:demo-session:v1")).toBeNull();
  await view.unmountAsync();
});

test.each(["candidate", "employer"] as const)(
  "registration submits valid %s fields and consent",
  async (role) => {
    const services = createAppServices();
    const signIn = jest.spyOn(services.sessions, "signIn");
    const view = await renderApp(<AuthScreen register />, services);
    if (role === "employer") {
      fireEvent.press(view.getByRole("button", { name: "İşveren" }));
      fireEvent.changeText(view.getByLabelText("Şirket Adı"), "Vettingo");
    }
    fireEvent.changeText(view.getByLabelText("Ad"), "Alex");
    fireEvent.changeText(view.getByLabelText("Soyad"), "Test");
    fireEvent.changeText(
      view.getByLabelText("E-posta Adresi"),
      "alex@vettingo.com",
    );
    fireEvent.changeText(view.getByLabelText("Şifre"), "secret");
    fireEvent(
      view.getByLabelText("Koşulları kabul ediyorum"),
      "valueChange",
      true,
    );
    fireEvent.press(view.getByRole("button", { name: "Kayıt Ol" }));
    await waitFor(() =>
      expect(router.replace).toHaveBeenCalledWith(`/${role}-dashboard`),
    );
    expect(signIn).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Alex",
        surname: "Test",
        role,
        terms: true,
        register: true,
      }),
    );
    const saved = JSON.parse(
      (await AsyncStorage.getItem("vettingo:demo-session:v1"))!,
    );
    expect(saved).toMatchObject({ name: "Alex Test", role });
    expect(saved).not.toHaveProperty("password");
    await view.unmountAsync();
  },
);

test("login shows a submission error and allows retry", async () => {
  const services = createAppServices();
  jest
    .spyOn(services.sessions, "signIn")
    .mockRejectedValueOnce(new Error("Offline"));
  const view = await renderApp(<AuthScreen />, services);
  fireEvent.changeText(
    view.getByLabelText("E-posta Adresi"),
    "alex@vettingo.com",
  );
  fireEvent.changeText(view.getByLabelText("Şifre"), "secret");
  fireEvent.press(view.getByRole("button", { name: "Giriş Yap" }));
  await waitFor(() =>
    expect(
      view.getByText("Oturum açılamadı. Lütfen tekrar deneyin."),
    ).toBeTruthy(),
  );
  expect(router.replace).not.toHaveBeenCalled();
  await waitFor(() =>
    expect(
      view.getByRole("button", { name: "Giriş Yap" }).props.accessibilityState
        .disabled,
    ).toBe(false),
  );
  fireEvent.press(view.getByRole("button", { name: "Giriş Yap" }));
  await waitFor(() =>
    expect(router.replace).toHaveBeenCalledWith("/candidate-dashboard"),
  );
  expect(
    view.queryByText("Oturum açılamadı. Lütfen tekrar deneyin."),
  ).toBeNull();
  await view.unmountAsync();
});

test("login disables repeat submission while sign-in is pending", async () => {
  const services = createAppServices();
  type SignInResult = Awaited<ReturnType<typeof services.sessions.signIn>>;
  let finishSignIn!: (result: SignInResult) => void;
  const pending = new Promise<SignInResult>((resolve) => {
    finishSignIn = resolve;
  });
  const signIn = jest
    .spyOn(services.sessions, "signIn")
    .mockReturnValueOnce(pending);
  const view = await renderApp(<AuthScreen />, services);
  fireEvent.changeText(
    view.getByLabelText("E-posta Adresi"),
    "alex@vettingo.com",
  );
  fireEvent.changeText(view.getByLabelText("Şifre"), "secret");
  fireEvent.press(view.getByRole("button", { name: "Giriş Yap" }));
  await waitFor(() =>
    expect(
      view.getByRole("button", { name: "Giriş Yap" }).props.accessibilityState
        .disabled,
    ).toBe(true),
  );
  fireEvent.press(view.getByRole("button", { name: "Giriş Yap" }));
  expect(signIn).toHaveBeenCalledTimes(1);
  await act(async () => {
    finishSignIn({
      session: { ...session, role: "candidate" },
      state: services.sessions.createWorkspace(),
    });
  });
  expect(router.replace).toHaveBeenCalledWith("/candidate-dashboard");
  await view.unmountAsync();
});
test("job search and filter dialog change actual results", async () => {
  const view = await signedIn(<JobSearchScreen />);
  await waitFor(() => expect(view.getByText("VP of Engineering")).toBeTruthy());
  fireEvent.press(view.getByRole("button", { name: "Filtreler" }));
  fireEvent.press(view.getByRole("button", { name: "Filtreleri Temizle" }));
  fireEvent.press(view.getByRole("button", { name: "Sonuçları Göster" }));
  fireEvent.changeText(
    view.getByLabelText("Pozisyon veya şirket ara"),
    "Globex",
  );
  expect(view.getByText("Director of Engineering")).toBeTruthy();
  expect(view.queryByText("VP of Engineering")).toBeNull();
});
test("candidate search resolves a different candidate and stage filters", async () => {
  const view = await signedIn(<CandidatesScreen />, "hr");
  await waitFor(() => expect(view.getByText("Zeynep Kaya")).toBeTruthy());
  fireEvent.changeText(
    view.getByLabelText("Aday, pozisyon veya yetenek ara"),
    "Zeynep",
  );
  expect(view.getByText("Zeynep Kaya")).toBeTruthy();
  expect(view.queryByText("Sarah Jenkins")).toBeNull();
});
test("requisition form exposes conditional office selection and validates title", async () => {
  const view = await signedIn(<RequisitionScreen />, "employer");
  await waitFor(() => expect(view.getByText("New Requisition")).toBeTruthy());
  expect(view.queryByText("Ofis")).toBeNull();
  fireEvent.press(view.getByRole("button", { name: "Hybrid" }));
  expect(view.getByText("Ofis")).toBeTruthy();
  fireEvent.press(view.getByRole("button", { name: "Devam Et" }));
  expect(view.getByText("Devam etmek için pozisyon adını girin.")).toBeTruthy();
});
test("CV review adds a skill and saves the edited profile", async () => {
  const view = await signedIn(<CvReviewScreen />);
  await waitFor(() =>
    expect(view.getByText("Review Parsed Data")).toBeTruthy(),
  );
  fireEvent.press(view.getByRole("button", { name: "Yetenek Ekle" }));
  fireEvent.changeText(view.getByLabelText("Yetenek"), "React Native");
  fireEvent.press(view.getByRole("button", { name: "Kaydet" }));
  expect(view.getByText("React Native ×")).toBeTruthy();
  fireEvent.press(
    view.getByRole("button", { name: "Doğrula ve Profili Kaydet" }),
  );
  await waitFor(async () =>
    expect(
      JSON.parse(
        (await AsyncStorage.getItem(
          "vettingo:workspace:v1:candidate:test@vettingo.com",
        ))!,
      ).cv.skills,
    ).toContain("React Native"),
  );
});
test("comparison keeps separate decisions when changing candidates", async () => {
  const view = await signedIn(<ComparisonScreen />, "employer");
  await waitFor(() =>
    expect(view.getByText("Yetenek Karşılaştırma")).toBeTruthy(),
  );
  fireEvent.press(view.getByRole("button", { name: "Adayı İlerlet" }));
  fireEvent.press(view.getByRole("button", { name: "Marcus Chen" }));
  fireEvent.press(view.getByRole("button", { name: "Adayı Reddet" }));
  await waitFor(async () => {
    const data = JSON.parse(
      (await AsyncStorage.getItem(
        "vettingo:workspace:v1:employer:test@vettingo.com",
      ))!,
    );
    expect(data.decisions["sarah-jenkins"].action).toBe("advanced");
    expect(data.decisions["marcus-chen"].action).toBe("rejected");
  });
});
test("assessment accepts an answer, advances and locks after submission", async () => {
  const view = await signedIn(<AssessmentScreen />);
  await waitFor(() => expect(view.getByText("Soru 4 / 20")).toBeTruthy());
  fireEvent.press(view.getByRole("radio", { name: /API 404/ }));
  fireEvent.press(view.getByRole("button", { name: "Sonraki" }));
  expect(view.getByText("Soru 5 / 20")).toBeTruthy();
  fireEvent.press(view.getByRole("button", { name: "Değerlendirmeyi Bitir" }));
  fireEvent.press(
    view.getByRole("button", { name: "Yanıtları Kaydet ve Bitir" }),
  );
  expect(view.getByText("Değerlendirme tamamlandı")).toBeTruthy();
  await view.unmountAsync();
});
test("signing into another role resets workspace and never stores password", async () => {
  let app: ReturnType<typeof useApp>;
  function Probe() {
    app = useApp();
    return null;
  }
  const view = await renderApp(<Probe />);
  await waitFor(() => expect(app!.ready).toBe(true));
  await act(async () => {
    await app!.signIn({
      ...session,
      password: "secret",
      register: false,
    } as Parameters<typeof app.signIn>[0]);
  });
  act(() =>
    app!.dispatch({
      type: "decision",
      candidateId: "sarah",
      action: "rejected",
    }),
  );
  await act(async () => {
    await app!.signIn({
      ...session,
      role: "hr",
      password: "secret",
      register: false,
    } as Parameters<typeof app.signIn>[0]);
  });
  expect(app!.state.decisions).toEqual({});
  expect(await AsyncStorage.getItem("vettingo:demo-session:v1")).not.toContain(
    "password",
  );
  await act(async () => {
    await app!.signOut();
  });
  expect(await AsyncStorage.getItem("vettingo:demo-session:v1")).toBeNull();
  await view.unmountAsync();
});
