jest.unmock("expo-router");

import AsyncStorage from "@react-native-async-storage/async-storage";
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
