import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  act,
  fireEvent,
  renderAsync,
  waitFor,
} from "@testing-library/react-native";
import { createAppServices } from "../src/composition/createAppServices";
import { AppProvider } from "../src/core/presentation/state/AppProvider";
import AuthScreen from "../src/features/auth/presentation/screens/AuthScreen";
import DashboardScreen from "../src/features/dashboard/presentation/screens/DashboardScreen";

const session = {
  email: "startup@vettingo.com",
  name: "Alex",
  role: "candidate",
  company: "",
  remember: true,
};

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

test("startup only checks the session and opens login without loading catalogs", async () => {
  const services = createAppServices();
  type Restored = Awaited<ReturnType<typeof services.sessions.restore>>;
  let finishRestore!: (value: Restored) => void;
  jest.spyOn(services.sessions, "restore").mockReturnValueOnce(
    new Promise<Restored>((resolve) => {
      finishRestore = resolve;
    }),
  );
  const loadCatalogs = jest
    .spyOn(services, "loadCatalogs")
    .mockRejectedValue(new Error("Catalog unavailable"));
  const view = await renderAsync(
    <AppProvider services={services}>
      <AuthScreen dashboardShortcuts={false} />
    </AppProvider>,
  );

  expect(view.getByLabelText("Vettingo yükleniyor…")).toBeTruthy();
  expect(loadCatalogs).not.toHaveBeenCalled();
  await act(async () => {
    finishRestore({ session: null, state: services.sessions.createWorkspace() });
  });

  expect(view.getByRole("button", { name: "Giriş Yap" })).toBeTruthy();
  expect(view.queryByRole("progressbar")).toBeNull();
  expect(loadCatalogs).not.toHaveBeenCalled();
  await view.unmountAsync();
});

test("restored sessions load catalogs after the startup logo has ended", async () => {
  await AsyncStorage.setItem("vettingo:demo-session:v1", JSON.stringify(session));
  const services = createAppServices();
  const loadCatalogs = services.loadCatalogs;
  let finishCatalogs!: () => void;
  const pending = new Promise<void>((resolve) => {
    finishCatalogs = resolve;
  });
  jest.spyOn(services, "loadCatalogs").mockImplementationOnce(async () => {
    await pending;
    await loadCatalogs();
  });
  const view = await renderAsync(
    <AppProvider services={services}>
      <DashboardScreen />
    </AppProvider>,
  );

  await waitFor(() =>
    expect(view.getByLabelText("Veriler yükleniyor…")).toBeTruthy(),
  );
  expect(view.queryByLabelText("Vettingo yükleniyor…")).toBeNull();
  expect(view.queryByText("Merhaba, Alex")).toBeNull();
  await act(async () => {
    finishCatalogs();
  });
  expect(view.getByText("Merhaba, Alex")).toBeTruthy();
  expect(view.queryByRole("progressbar")).toBeNull();
  await view.unmountAsync();
});

test("authenticated catalog failures can be retried without restoring the session again", async () => {
  await AsyncStorage.setItem("vettingo:demo-session:v1", JSON.stringify(session));
  const services = createAppServices();
  const restore = jest.spyOn(services.sessions, "restore");
  const loadCatalogs = jest
    .spyOn(services, "loadCatalogs")
    .mockRejectedValueOnce(new Error("Offline"));
  const view = await renderAsync(
    <AppProvider services={services}>
      <DashboardScreen />
    </AppProvider>,
  );

  await waitFor(() => expect(view.getByText("Veriler yüklenemedi.")).toBeTruthy());
  expect(view.queryByLabelText("Vettingo yükleniyor…")).toBeNull();
  fireEvent.press(view.getByRole("button", { name: "Tekrar Dene" }));
  await waitFor(() => expect(view.getByText("Merhaba, Alex")).toBeTruthy());
  expect(loadCatalogs).toHaveBeenCalledTimes(2);
  expect(restore).toHaveBeenCalledTimes(1);
  await view.unmountAsync();
});

test("an unreadable saved session still opens login without loading catalogs", async () => {
  const services = createAppServices();
  jest.spyOn(services.sessions, "restore").mockRejectedValueOnce(new Error("Disk"));
  const loadCatalogs = jest.spyOn(services, "loadCatalogs");
  const view = await renderAsync(
    <AppProvider services={services}>
      <AuthScreen dashboardShortcuts={false} />
    </AppProvider>,
  );

  await waitFor(() =>
    expect(view.getByRole("button", { name: "Giriş Yap" })).toBeTruthy(),
  );
  expect(view.queryByRole("progressbar")).toBeNull();
  expect(loadCatalogs).not.toHaveBeenCalled();
  await view.unmountAsync();
});
