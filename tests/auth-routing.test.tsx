jest.unmock("expo-router");

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import {
  act,
  fireEvent,
  renderRouter,
  screen,
  waitFor,
} from "expo-router/testing-library";

beforeEach(async () => {
  await AsyncStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

test.each([
  { start: "/login", employer: false, destination: "/candidate-dashboard" },
  { start: "/register", employer: false, destination: "/employer-dashboard" },
  { start: "/register", employer: true, destination: "/hr-dashboard" },
])(
  "preview from $start opens $destination with the real protected router",
  async ({ start, employer, destination }) => {
    const view = await renderRouter("src/app", { initialUrl: start });
    const label = start === "/login" ? "Giriş Yap" : "Kayıt Ol";
    await waitFor(() =>
      expect(screen.getByRole("button", { name: label })).toBeTruthy(),
    );
    if (employer)
      await fireEvent.press(screen.getByRole("button", { name: "İşveren" }));
    await act(async () => {
      await fireEvent.press(screen.getByRole("button", { name: label }));
    });
    const codePath =
      start === "/login" ? "/verify-login-code" : "/verify-email";
    await waitFor(() => expect(view.getPathname()).toBe(codePath));
    expect(screen.queryByRole("tab", { name: "Ana Sayfa" })).toBeNull();
    expect(await AsyncStorage.getAllKeys()).toEqual([]);
    await fireEvent.changeText(screen.getByLabelText("Kod"), "123456");
    await fireEvent.press(
      screen.getByRole("button", {
        name: start === "/login" ? "Giriş Kodunu Gir" : "Kaydını Tamamla",
      }),
    );
    await waitFor(() => expect(view.getPathname()).toBe(destination));
    expect(screen.getByRole("tab", { name: "Ana Sayfa" })).toBeTruthy();
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(await AsyncStorage.getAllKeys()).toEqual([]);
  },
  60000,
);

test("password reset preview opens each form with empty fields and supports going back", async () => {
  const view = await renderRouter("src/app", { initialUrl: "/login" });
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Şifrenizi mi unuttunuz?" }),
    ).toBeTruthy(),
  );
  await fireEvent.press(
    screen.getByRole("button", { name: "Şifrenizi mi unuttunuz?" }),
  );
  await waitFor(() => expect(view.getPathname()).toBe("/forgot-password"));
  expect(screen.getByLabelText("Vettingo logosu")).toBeTruthy();
  expect(screen.getByLabelText("E-posta Adresi")).toHaveDisplayValue("");
  await fireEvent.press(screen.getByRole("button", { name: "Kod Gönder" }));
  await waitFor(() => expect(view.getPathname()).toBe("/verify-reset-code"));
  expect(screen.getByLabelText("Vettingo logosu")).toBeTruthy();
  expect(screen.getByLabelText("Kod")).toHaveDisplayValue("");
  await fireEvent.changeText(screen.getByLabelText("Kod"), "123456");
  expect(screen.getByLabelText("Kod")).toHaveDisplayValue("123456");
  await fireEvent.changeText(screen.getByLabelText("Kod"), "");
  await fireEvent.press(screen.getByRole("button", { name: "Kod Gir" }));
  await waitFor(() => expect(view.getPathname()).toBe("/reset-password"));
  expect(screen.getByLabelText("Vettingo logosu")).toBeTruthy();
  for (const label of ["Yeni Şifre", "Yeni Şifre Tekrar"]) {
    const field = screen.getByLabelText(label);
    expect(field).toHaveDisplayValue("");
    expect(field.props.secureTextEntry).toBe(true);
    await fireEvent.changeText(field, "preview-password");
    expect(screen.getByLabelText(label)).toHaveDisplayValue("preview-password");
    await fireEvent.changeText(screen.getByLabelText(label), "");
  }
  await fireEvent.press(
    screen.getByRole("button", { name: "Kod ekranına dön" }),
  );
  await waitFor(() => expect(view.getPathname()).toBe("/verify-reset-code"));
  await fireEvent.press(
    screen.getByRole("button", { name: "E-posta ekranına dön" }),
  );
  await waitFor(() => expect(view.getPathname()).toBe("/forgot-password"));
  await fireEvent.press(screen.getByRole("button", { name: "Kod Gönder" }));
  await waitFor(() => expect(view.getPathname()).toBe("/verify-reset-code"));
  await fireEvent.press(screen.getByRole("button", { name: "Kod Gir" }));
  await waitFor(() => expect(view.getPathname()).toBe("/reset-password"));
  await fireEvent.press(
    screen.getByRole("button", { name: "Şifreni Değiştir" }),
  );
  await waitFor(() => expect(view.getPathname()).toBe("/login"));
  expect(await AsyncStorage.getAllKeys()).toEqual([]);
}, 60000);

test("job search cards open a blank candidate detail page and allow going back", async () => {
  const view = await renderRouter("src/app", { initialUrl: "/login" });
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Giriş Yap" })).toBeTruthy(),
  );
  await act(async () => {
    await fireEvent.press(screen.getByRole("button", { name: "Giriş Yap" }));
  });
  await waitFor(() => expect(view.getPathname()).toBe("/verify-login-code"));
  await fireEvent.press(
    screen.getByRole("button", { name: "Giriş Kodunu Gir" }),
  );
  await waitFor(() => expect(view.getPathname()).toBe("/candidate-dashboard"));
  await fireEvent.press(screen.getByRole("tab", { name: "Arama" }));
  await waitFor(() => expect(view.getPathname()).toBe("/job-search"));
  expect(screen.getByPlaceholderText("Pozisyon ara")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Başvur" })).toBeNull();
  expect(
    screen.queryByRole("button", { name: "Başvuru Gönderildi" }),
  ).toBeNull();

  await fireEvent.press(
    screen.getByRole("button", { name: "VP of Engineering ilan detayını aç" }),
  );
  await waitFor(() => expect(view.getPathname()).toBe("/job-detail"));
  expect(view.getSearchParams()).toEqual({ id: "vp-engineering-acme" });
  expect(screen.getByText("Vettingo")).toBeTruthy();
  expect(screen.getAllByRole("tab")).toHaveLength(4);
  expect(screen.getByRole("tab", { name: "Arama" })).toBeSelected();
  expect(screen.queryByText("VP of Engineering")).toBeNull();
  expect(screen.queryByPlaceholderText("Pozisyon ara")).toBeNull();
  expect(screen.queryByRole("button", { name: "Başvur" })).toBeNull();

  await fireEvent.press(screen.getByRole("button", { name: "Geri" }));
  await waitFor(() => expect(view.getPathname()).toBe("/job-search"));
  expect(screen.getByPlaceholderText("Pozisyon ara")).toBeTruthy();
}, 30000);

test.each(["candidate", "employer", "hr"])(
  "%s keeps Profile selected throughout its profile menu pages",
  async (role) => {
    await AsyncStorage.setItem(
      "vettingo:demo-session:v1",
      JSON.stringify({
        email: "profile-navigation@vettingo.com",
        name: "Alex",
        role,
        company: "Vettingo",
        remember: true,
      }),
    );
    const profilePath = `/${role}-profile`;
    const view = await renderRouter("src/app", { initialUrl: profilePath });
    const expectProfileSelected = () => {
      expect(screen.getByRole("tab", { name: "Profil" })).toBeSelected();
      expect(screen.getAllByRole("tab", { selected: true })).toHaveLength(1);
    };
    await waitFor(expectProfileSelected);

    const pages = [
      ...(role === "candidate"
        ? [
            ["Profil", "/candidate-profile-details"],
            ["Bildirimler", "/notifications"],
            ["CV", "/cv-review"],
            ["Kişiselleştirilmiş İlanlar", "/candidate-personalized-jobs"],
          ]
        : [
            ["Şirket", `/${role}-company`],
            ["Bildirimler", "/notifications"],
            ["Scout", "/scout"],
          ]),
      ["Güvenlik", `/${role}-security`],
      ["Yardım Merkezi", `/${role}-help`],
    ];
    for (const [label, path] of pages) {
      await fireEvent.press(screen.getByRole("button", { name: label }));
      await waitFor(() => expect(view.getPathname()).toBe(path));
      expectProfileSelected();
      if (label === "Kişiselleştirilmiş İlanlar") {
        expect(screen.getByText("Lead UI Developer")).toBeTruthy();
        expect(screen.getByText("Senior Software Engineer")).toBeTruthy();
        await fireEvent.press(
          screen.getByRole("button", {
            name: "Lead UI Developer ilan detayını aç",
          }),
        );
        await waitFor(() => expect(view.getPathname()).toBe("/job-detail"));
        expectProfileSelected();
        await fireEvent.press(screen.getByRole("button", { name: "Geri" }));
        await waitFor(() =>
          expect(view.getPathname()).toBe("/candidate-personalized-jobs"),
        );
        expectProfileSelected();
      }
      if (label === "Scout") {
        await fireEvent.press(
          screen.getByRole("button", { name: "Sarah Jenkins profilini aç" }),
        );
        await waitFor(() =>
          expect(view.getPathname()).toBe("/candidate-detail"),
        );
        expectProfileSelected();
        await fireEvent.press(screen.getByRole("button", { name: "Geri" }));
        await waitFor(() => expect(view.getPathname()).toBe("/scout"));
        expectProfileSelected();
      }
      if (label === "Bildirimler") {
        expect(screen.getAllByText("Vettingo")).toHaveLength(1);
        expect(screen.getAllByRole("tab")).toHaveLength(4);
        expect(screen.getByRole("button", { name: "Geri" })).toBeTruthy();
        expect(screen.queryByText("Bildirimler")).toBeNull();
        await waitFor(() =>
          expect(screen.queryByLabelText("Bildirimler yükleniyor")).toBeNull(),
        );
        expect(screen.queryByRole("alert")).toBeNull();
        expect(
          screen.queryByRole("button", { name: "Tekrar Dene" }),
        ).toBeNull();
        expect(screen.queryByText("Vettingo’ya hoş geldin!")).toBeNull();
        expect(screen.queryByText("Alex")).toBeNull();
        await fireEvent.press(screen.getByRole("button", { name: "Geri" }));
      } else {
        await fireEvent.press(screen.getByRole("button", { name: "Geri" }));
      }
      await waitFor(() => expect(view.getPathname()).toBe(profilePath));
      expectProfileSelected();
    }

    await fireEvent(
      screen.getByRole("switch", { name: "Bildirim tercihi" }),
      "valueChange",
      true,
    );
    expectProfileSelected();
    if (role !== "candidate") {
      const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
      await fireEvent.press(
        screen.getByRole("button", { name: "Ekip ve Yetkiler" }),
      );
      expect(alert).toHaveBeenCalled();
      expectProfileSelected();
    }
    const otherTab = role === "candidate" ? "Başvurularım" : "İlanlar";
    await fireEvent.press(screen.getByRole("tab", { name: otherTab }));
    await waitFor(() =>
      expect(screen.getByRole("tab", { name: otherTab })).toBeSelected(),
    );
    expect(screen.getByRole("tab", { name: "Profil" })).not.toBeSelected();
  },
  60000,
);

test.each([
  { path: "/verify-login-code", button: "Giriş Kodunu Gir", form: "/login" },
  { path: "/verify-email", button: "Kaydını Tamamla", form: "/register" },
])(
  "opening $path directly cannot create a session",
  async ({ path, button, form }) => {
    const view = await renderRouter("src/app", { initialUrl: path });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: button })).toBeTruthy(),
    );
    await fireEvent.press(screen.getByRole("button", { name: button }));
    await waitFor(() => expect(view.getPathname()).toBe(form));
    expect(await AsyncStorage.getAllKeys()).toEqual([]);
  },
  30000,
);

test("returning from registration verification allows changing the preview destination", async () => {
  const view = await renderRouter("src/app", { initialUrl: "/register" });
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Kayıt Ol" })).toBeTruthy(),
  );
  await fireEvent.press(screen.getByRole("button", { name: "Kayıt Ol" }));
  await waitFor(() => expect(view.getPathname()).toBe("/verify-email"));
  await fireEvent.press(
    screen.getByRole("button", { name: "Kayıt ekranına dön" }),
  );
  await waitFor(() => expect(view.getPathname()).toBe("/register"));
  await fireEvent.press(screen.getByRole("button", { name: "İşveren" }));
  await fireEvent.press(screen.getByRole("button", { name: "Kayıt Ol" }));
  await waitFor(() => expect(view.getPathname()).toBe("/verify-email"));
  await fireEvent.press(
    screen.getByRole("button", { name: "Kaydını Tamamla" }),
  );
  await waitFor(() => expect(view.getPathname()).toBe("/hr-dashboard"));
  expect(await AsyncStorage.getAllKeys()).toEqual([]);
}, 30000);
