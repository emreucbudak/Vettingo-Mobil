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
    const view = renderRouter("src/app", { initialUrl: start });
    const label = start === "/login" ? "Giriş Yap" : "Kayıt Ol";
    await waitFor(() =>
      expect(screen.getByRole("button", { name: label })).toBeTruthy(),
    );
    if (employer)
      fireEvent.press(screen.getByRole("button", { name: "İşveren" }));
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: label }));
    });
    await waitFor(() => expect(view.getPathname()).toBe(destination));
    expect(screen.getByRole("tab", { name: "Ana Sayfa" })).toBeTruthy();
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(await AsyncStorage.getAllKeys()).toEqual([]);
  },
  30000,
);

test("job search cards open a blank candidate detail page and allow going back", async () => {
  const view = renderRouter("src/app", { initialUrl: "/login" });
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Giriş Yap" })).toBeTruthy(),
  );
  await act(async () => {
    fireEvent.press(screen.getByRole("button", { name: "Giriş Yap" }));
  });
  await waitFor(() => expect(view.getPathname()).toBe("/candidate-dashboard"));
  fireEvent.press(screen.getByRole("tab", { name: "Arama" }));
  await waitFor(() => expect(view.getPathname()).toBe("/job-search"));
  expect(screen.getByPlaceholderText("Pozisyon ara")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Başvur" })).toBeNull();
  expect(
    screen.queryByRole("button", { name: "Başvuru Gönderildi" }),
  ).toBeNull();

  fireEvent.press(
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

  fireEvent.press(screen.getByRole("button", { name: "Geri" }));
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
    const view = renderRouter("src/app", { initialUrl: profilePath });
    const expectProfileSelected = () => {
      expect(screen.getByRole("tab", { name: "Profil" })).toBeSelected();
      expect(screen.getAllByRole("tab", { selected: true })).toHaveLength(1);
    };
    await waitFor(expectProfileSelected);

    const pages = [
      ...(role === "candidate"
        ? [
            ["Profil", "/candidate-profile-details"],
            ["CV", "/cv-review"],
          ]
        : [
            ["Şirket", `/${role}-company`],
            ["Scout", "/scout"],
          ]),
      ["Güvenlik", `/${role}-security`],
      ["Yardım Merkezi", `/${role}-help`],
    ];
    for (const [label, path] of pages) {
      fireEvent.press(screen.getByRole("button", { name: label }));
      await waitFor(() => expect(view.getPathname()).toBe(path));
      expectProfileSelected();
      if (label === "Scout") {
        fireEvent.press(
          screen.getByRole("button", { name: "Sarah Jenkins profilini aç" }),
        );
        await waitFor(() =>
          expect(view.getPathname()).toBe("/candidate-detail"),
        );
        expectProfileSelected();
        fireEvent.press(screen.getByRole("button", { name: "Geri" }));
        await waitFor(() => expect(view.getPathname()).toBe("/scout"));
        expectProfileSelected();
      }
      fireEvent.press(screen.getByRole("button", { name: "Geri" }));
      await waitFor(() => expect(view.getPathname()).toBe(profilePath));
      expectProfileSelected();
    }

    fireEvent(
      screen.getByRole("switch", { name: "Bildirim tercihi" }),
      "valueChange",
      true,
    );
    expectProfileSelected();
    if (role !== "candidate") {
      const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
      fireEvent.press(screen.getByRole("button", { name: "Ekip ve Yetkiler" }));
      expect(alert).toHaveBeenCalled();
      expectProfileSelected();
    }
    const otherTab = role === "candidate" ? "Başvurularım" : "İlanlar";
    fireEvent.press(screen.getByRole("tab", { name: otherTab }));
    await waitFor(() =>
      expect(screen.getByRole("tab", { name: otherTab })).toBeSelected(),
    );
    expect(screen.getByRole("tab", { name: "Profil" })).not.toBeSelected();
  },
  60000,
);
