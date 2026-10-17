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
