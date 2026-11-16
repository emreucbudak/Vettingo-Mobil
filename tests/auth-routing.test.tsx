jest.unmock("expo-router");

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  act,
  fireEvent,
  renderRouter,
  screen,
  waitFor,
} from "expo-router/testing-library";
import { initialWorkspace } from "../src/core/data/datasources/DemoWorkspaceSource";

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
    screen.getByRole("button", { name: "Acme Corp şirket detayını aç" }),
  );
  await waitFor(() =>
    expect(view.getPathname()).toBe("/candidate-company-detail"),
  );
  expect(screen.getByRole("header", { name: "Acme Corp" })).toBeTruthy();
  expect(screen.getByText("Açık Pozisyon")).toBeTruthy();
  expect(
    screen.queryByRole("button", { name: "Şirket bilgilerini düzenle" }),
  ).toBeNull();
  expect(screen.getByRole("tab", { name: "Arama" })).toBeSelected();
  await fireEvent.press(screen.getByRole("button", { name: "Geri" }));
  await waitFor(() => expect(view.getPathname()).toBe("/job-search"));

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

test.each(["employer", "hr"])(
  "%s hides saved demo jobs and keeps İlanlar selected for published jobs",
  async (role) => {
    const email = "jobs-navigation@vettingo.com";
    await AsyncStorage.setItem(
      "vettingo:demo-session:v1",
      JSON.stringify({
        email,
        name: "Alex",
        role,
        company: "Vettingo",
        remember: true,
      }),
    );
    const workspace = initialWorkspace();
    workspace.requisitions.push({
      ...workspace.requisitions[0],
      id: "requisition-1",
      title: "Frontend Developer",
      description: "Lead the frontend team.",
    });
    await AsyncStorage.setItem(
      `vettingo:workspace:v1:${role}:${email}`,
      JSON.stringify(workspace),
    );
    const jobsPath = `/${role}-jobs`;
    const view = await renderRouter("src/app", { initialUrl: jobsPath });
    const newJob = await screen.findByRole("button", { name: "Yeni İlan" });
    expect(screen.getByRole("tab", { name: "İlanlar" })).toBeSelected();
    expect(
      screen.getAllByRole("button", { name: /adaylarını gör$/ }),
    ).toHaveLength(1);
    await fireEvent.press(newJob);
    await waitFor(() => expect(view.getPathname()).toBe("/new-requisition"));
    expect(screen.getByRole("tab", { name: "İlanlar" })).toBeSelected();
    expect(screen.getAllByRole("tab", { selected: true })).toHaveLength(1);
    await fireEvent.press(screen.getByRole("button", { name: "Geri" }));
    await waitFor(() => expect(view.getPathname()).toBe(jobsPath));

    await fireEvent.press(
      screen.getByRole("button", { name: "Frontend Developer adaylarını gör" }),
    );
    await waitFor(() =>
      expect(view.getPathname()).toBe("/requisition-candidates"),
    );
    expect(view.getSearchParams()).toEqual({ requisitionId: "requisition-1" });
    expect(screen.getByRole("tab", { name: "İlanlar" })).toBeSelected();
    expect(
      screen.queryByRole("header", { name: "Frontend Developer · Adaylar" }),
    ).toBeNull();
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    expect(await screen.findByText("Bu ilan için henüz aday yok.")).toBeTruthy();
    expect(screen.queryAllByRole("button", { name: /profilini aç/ })).toHaveLength(
      0,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Geri" }));
    await waitFor(() => expect(view.getPathname()).toBe(jobsPath));
  },
  60000,
);

test.each(["employer", "hr"])(
  "%s opens requisition candidates from the dashboard",
  async (role) => {
    await AsyncStorage.setItem(
      "vettingo:demo-session:v1",
      JSON.stringify({
        email: "dashboard-navigation@vettingo.com",
        name: "Alex",
        role,
        company: "Vettingo",
        remember: true,
      }),
    );
    const dashboardPath = `/${role}-dashboard`;
    const view = await renderRouter("src/app", { initialUrl: dashboardPath });
    await fireEvent.press(
      await screen.findByRole("button", {
        name: "Lead Data Scientist adaylarını gör",
      }),
    );
    await waitFor(() =>
      expect(view.getPathname()).toBe("/requisition-candidates"),
    );
    expect(view.getSearchParams()).toEqual({
      requisitionId: "data-scientist",
      tab: "home",
    });
    expect(screen.getByRole("tab", { name: "Ana Sayfa" })).toBeSelected();
    expect(screen.queryAllByRole("button", { name: /profilini aç/ })).toHaveLength(
      1,
    );
    await fireEvent.press(
      screen.getByRole("button", { name: "Zeynep Kaya profilini aç" }),
    );
    await waitFor(() => expect(view.getPathname()).toBe("/candidate-detail"));
    expect(screen.getByRole("tab", { name: "Ana Sayfa" })).toBeSelected();
    await fireEvent.press(screen.getByRole("button", { name: "Geri" }));
    await waitFor(() =>
      expect(view.getPathname()).toBe("/requisition-candidates"),
    );
    await fireEvent.press(screen.getByRole("button", { name: "Geri" }));
    await waitFor(() => expect(view.getPathname()).toBe(dashboardPath));
  },
  60000,
);

test.each(["candidate", "employer", "hr"])(
  "%s can navigate its profile menu pages and return to the selected tab",
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
    if (role === "candidate") {
      expect(screen.queryByRole("button", { name: "Sınavlar" })).toBeNull();
    }
    if (role === "employer") {
      expect(
        screen.queryByRole("button", { name: "Abonelik Planları" }),
      ).toBeNull();
      expect(
        screen.queryByRole("button", { name: "Hesap Aboneliği" }),
      ).toBeNull();
    }

    const pages = [
      ...(role === "candidate"
        ? [
            ["Profil", "/candidate-profile-details"],
            ["Bildirimler", "/notifications"],
            ["Özgeçmiş", "/cv-review"],
            ["Kişiselleştirilmiş İlanlar", "/candidate-personalized-jobs"],
          ]
        : [
            ["Şirket", `/${role}-company`],
            ["Bildirimler", "/notifications"],
            ["Sınavlar", "/exams"],
            ...(role === "employer" ? [["Ekip", "/employer-team"]] : []),
          ]),
      [
        role === "employer" ? "Hesap ve Güvenlik" : "Güvenlik",
        `/${role}-security`,
      ],
      ["Yardım Merkezi", `/${role}-help`],
    ];
    for (const [label, path] of pages) {
      await fireEvent.press(screen.getByRole("button", { name: label }));
      await waitFor(() => expect(view.getPathname()).toBe(path));
      expectProfileSelected();
      if (label === "Sınavlar") {
        expect(screen.getByText("Vettingo")).toBeTruthy();
        expect(screen.getAllByRole("tab")).toHaveLength(4);
        expect(screen.getByRole("button", { name: "Geri" })).toBeTruthy();
        for (const name of ["Sınav Adı", "Oluşturulma Tarihi", "İşlem"]) {
          expect(screen.getByRole("columnheader", { name })).toBeTruthy();
        }
        expect(screen.getByText("Sınav kaydı yok.")).toBeTruthy();
        expect(
          screen.getByRole("button", { name: "Sınavı Düzenle" }),
        ).toBeDisabled();
        expect(screen.getByRole("button", { name: "Sınavı Sil" })).toBeDisabled();
        await fireEvent.press(screen.getByRole("button", { name: "Yeni Sınav" }));
        await waitFor(() => expect(view.getPathname()).toBe("/create-exam"));
        expectProfileSelected();
        expect(screen.getByLabelText("Sınav Adı")).toBeTruthy();
        for (const label of ["Süre (Dakika)", "Geçme Notu"]) {
          expect(screen.getByLabelText(label).props.keyboardType).toBe(
            "number-pad",
          );
        }
        const trueFalse = screen.getByRole("button", { name: "Doğru / Yanlış" });
        const multipleChoice = screen.getByRole("button", {
          name: "Çoktan Seçmeli",
        });
        expect(
          screen.getAllByRole("button", {
            name: /^(Çoktan Seçmeli|Doğru \/ Yanlış)$/,
          }),
        ).toEqual([multipleChoice, trueFalse]);
        await fireEvent.press(multipleChoice);
        expect(screen.getByRole("header", { name: "Soru 1" })).toBeTruthy();
        for (const letter of ["A", "B", "C", "D", "E"]) {
          expect(screen.getByLabelText(`${letter} seçeneği`)).toBeTruthy();
        }
        await fireEvent.changeText(screen.getByLabelText("A seçeneği"), "Paris");
        await fireEvent.press(
          screen.getByRole("radio", {
            name: "A seçeneğini doğru cevap olarak işaretle",
          }),
        );
        await fireEvent.press(trueFalse);
        expect(screen.getByRole("header", { name: "Soru 2" })).toBeTruthy();
        expect(screen.getAllByLabelText("Soru Metni")).toHaveLength(2);
        expect(screen.getByLabelText("A seçeneği")).toHaveDisplayValue("Paris");
        expect(
          screen.getByRole("radio", {
            name: "A seçeneğini doğru cevap olarak işaretle",
          }),
        ).toBeChecked();
        await fireEvent.press(screen.getByRole("radio", { name: "Yanlış" }));
        expect(screen.getByRole("radio", { name: "Yanlış" })).toBeChecked();
        expect(screen.getByRole("radio", { name: "Doğru" })).not.toBeChecked();
        await fireEvent.press(screen.getByRole("button", { name: "Geri" }));
        await waitFor(() => expect(view.getPathname()).toBe("/exams"));
      }
      if (label === "Hesap ve Güvenlik") {
        expect(screen.queryByText("Hesap ve Güvenlik")).toBeNull();
        await fireEvent.press(
          screen.getByRole("button", { name: "Hesap Aboneliği" }),
        );
        await waitFor(() =>
          expect(view.getPathname()).toBe("/employer-plans"),
        );
        expect(screen.queryByText("Hesap Aboneliği")).toBeNull();
        expect(screen.queryByText("Örnek planlar ve fiyatlar")).toBeNull();
        expect(
          screen.getByRole("button", { name: "Başlangıç planını seç" }),
        ).toBeTruthy();
        await fireEvent.press(screen.getByRole("button", { name: "Geri" }));
        await waitFor(() => expect(view.getPathname()).toBe(path));
      }
      if (label === "Ekip") {
        expect(screen.getByText("İsim Soyisim")).toBeTruthy();
        expect(screen.getByText("Eklenme Tarihi")).toBeTruthy();
        expect(screen.getByText("İşlem Yap")).toBeTruthy();
        expect(screen.getByRole("button", { name: "Sil" })).toBeDisabled();
        await fireEvent.press(screen.getByRole("button", { name: "Düzenle" }));
        await waitFor(() =>
          expect(view.getPathname()).toBe("/employer-team-edit"),
        );
        expect(screen.getByText("Vettingo")).toBeTruthy();
        expect(screen.getAllByRole("tab")).toHaveLength(4);
        expect(screen.queryByText("İşlem Yap")).toBeNull();
        expect(screen.queryAllByRole("textbox")).toHaveLength(0);
        await fireEvent.press(screen.getByRole("button", { name: "Geri" }));
        await waitFor(() => expect(view.getPathname()).toBe(path));
        await fireEvent.press(
          screen.getByRole("button", { name: "Çalışan Ekle" }),
        );
        await waitFor(() =>
          expect(view.getPathname()).toBe("/employer-team-add"),
        );
        expect(screen.getByText("Vettingo")).toBeTruthy();
        expect(screen.getAllByRole("tab")).toHaveLength(4);
        expect(screen.queryByText("İsim Soyisim")).toBeNull();
        expect(screen.queryByText("HR Ekle")).toBeNull();
        expect(screen.getByLabelText("İsim")).toBeTruthy();
        expect(screen.getByLabelText("Soyisim")).toBeTruthy();
        expect(screen.getByLabelText("E-posta").props.keyboardType).toBe(
          "email-address",
        );
        expect(screen.getByLabelText("Şifre").props.secureTextEntry).toBe(true);
        expect(
          screen.getByRole("button", { name: "Çalışan Ekle" }),
        ).toBeDisabled();
        await fireEvent.press(screen.getByRole("button", { name: "Geri" }));
        await waitFor(() => expect(view.getPathname()).toBe(path));
      }
      if (label === "Şirket") {
        expect(screen.getByText("Açık Pozisyon")).toBeTruthy();
        const editButton = screen.queryByRole("button", {
          name: "Şirket bilgilerini düzenle",
        });
        if (role === "employer") {
          expect(editButton).toBeTruthy();
          await fireEvent.press(editButton!);
          await waitFor(() =>
            expect(view.getPathname()).toBe("/employer-company-edit"),
          );
          expect(screen.getAllByText("Vettingo")).toHaveLength(1);
          expect(screen.getAllByRole("tab")).toHaveLength(4);
          expect(screen.queryByText("Açık Pozisyon")).toBeNull();
          expect(screen.queryAllByRole("textbox")).toHaveLength(0);
          await fireEvent.press(screen.getByRole("button", { name: "Geri" }));
          await waitFor(() => expect(view.getPathname()).toBe(path));
        } else {
          expect(editButton).toBeNull();
        }
      }
      if (label === "Kişiselleştirilmiş İlanlar") {
        expect(screen.queryByText("Lead UI Developer")).toBeNull();
        expect(screen.queryByText("Senior Software Engineer")).toBeNull();
        expect(
          screen.getByText("Aramanızla eşleşen sonuç bulunamadı."),
        ).toBeTruthy();
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

    expect(
      screen.queryByRole("switch", { name: "Bildirim tercihi" }),
    ).toBeNull();
    expectProfileSelected();
    if (role !== "candidate") {
      expect(screen.queryByRole("button", { name: "Scout" })).toBeNull();
      expect(screen.queryByRole("tab", { name: "Adaylar" })).toBeNull();
      const expectScoutSelected = () => {
        expect(screen.getByRole("tab", { name: "Scout" })).toBeSelected();
        expect(screen.getAllByRole("tab", { selected: true })).toHaveLength(1);
      };
      await fireEvent.press(screen.getByRole("tab", { name: "Scout" }));
      await waitFor(() => expect(view.getPathname()).toBe("/scout"));
      expectScoutSelected();
      expect(screen.queryByRole("button", { name: "Geri" })).toBeNull();
      expect(screen.getByText("Henüz gösterilecek yetenek yok.")).toBeTruthy();
      await fireEvent.press(screen.getByRole("tab", { name: "Profil" }));
      await waitFor(() => expect(view.getPathname()).toBe(profilePath));
      expectProfileSelected();
    }
    if (role === "hr") {
      expect(
        screen.queryByRole("button", { name: "Ekip ve Yetkiler" }),
      ).toBeNull();
      expect(screen.queryByRole("button", { name: "Ekip" })).toBeNull();
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
