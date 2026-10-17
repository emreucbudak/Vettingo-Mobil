import React from "react";
import { Pressable, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  act,
  fireEvent,
  renderAsync,
  waitFor,
} from "@testing-library/react-native";
import { createAppServices } from "../src/composition/createAppServices";
import { AppProvider, useApp } from "../src/core/presentation/state/AppProvider";
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

test("startup only checks the session and opens login without async catalog loading", async () => {
  const services = createAppServices();
  type Restored = Awaited<ReturnType<typeof services.sessions.restore>>;
  let finishRestore!: (value: Restored) => void;
  jest.spyOn(services.sessions, "restore").mockReturnValueOnce(
    new Promise<Restored>((resolve) => {
      finishRestore = resolve;
    }),
  );
  const loadJobs = jest
    .spyOn(services.jobs, "load")
    .mockRejectedValue(new Error("Catalog unavailable"));
  const view = await renderAsync(
    <AppProvider services={services}>
      <AuthScreen dashboardShortcuts={false} />
    </AppProvider>,
  );

  expect(view.toJSON()).toBeNull();
  expect(loadJobs).not.toHaveBeenCalled();
  await act(async () => {
    finishRestore({ session: null, state: services.sessions.createWorkspace() });
  });

  expect(view.getByRole("button", { name: "Giriş Yap" })).toBeTruthy();
  expect(view.queryByRole("progressbar")).toBeNull();
  expect(loadJobs).not.toHaveBeenCalled();
  await view.unmountAsync();
});

test("rebuilding services preserves the active preview instead of returning to login", async () => {
  function Preview() {
    const { session, openTemporaryWorkspace } = useApp();
    return (
      <>
        <Text>{session?.role ?? "login"}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="İK Aç"
          onPress={() => openTemporaryWorkspace("hr")}
        />
      </>
    );
  }
  const view = await renderAsync(
    <AppProvider services={createAppServices()}>
      <Preview />
    </AppProvider>,
  );
  await waitFor(() => expect(view.getByText("login")).toBeTruthy());
  fireEvent.press(view.getByRole("button", { name: "İK Aç" }));
  expect(view.getByText("hr")).toBeTruthy();

  const refreshedServices = createAppServices();
  const restore = jest.spyOn(refreshedServices.sessions, "restore");
  await view.rerenderAsync(
    <AppProvider services={refreshedServices}>
      <Preview />
    </AppProvider>,
  );
  expect(view.getByText("hr")).toBeTruthy();
  expect(restore).not.toHaveBeenCalled();
  expect(await AsyncStorage.getAllKeys()).toEqual([]);
  await view.unmountAsync();
});

test("restored sessions show the dashboard without a catalog loading screen", async () => {
  await AsyncStorage.setItem("vettingo:demo-session:v1", JSON.stringify(session));
  const services = createAppServices();
  const pending = new Promise<void>(() => {});
  const loads = [
    jest.spyOn(services.jobs, "load").mockReturnValue(pending),
    jest.spyOn(services.candidates, "load").mockReturnValue(pending),
    jest.spyOn(services.questions, "load").mockReturnValue(pending),
    jest.spyOn(services.requisitionCatalog, "load").mockReturnValue(pending),
  ];
  const view = await renderAsync(
    <AppProvider services={services}>
      <DashboardScreen />
    </AppProvider>,
  );

  await waitFor(() => expect(view.getByText("Merhaba, Alex")).toBeTruthy());
  expect(view.queryByLabelText("Vettingo yükleniyor…")).toBeNull();
  expect(view.queryByLabelText("Veriler yükleniyor…")).toBeNull();
  expect(view.queryByRole("progressbar")).toBeNull();
  for (const load of loads) expect(load).not.toHaveBeenCalled();
  await view.unmountAsync();
});

test("demo catalogs are immediately available and isolated between service instances", () => {
  const first = createAppServices();
  const second = createAppServices();

  expect(first.jobs.catalog.jobs.length).toBeGreaterThan(0);
  expect(first.candidates.catalog.candidates.length).toBeGreaterThan(0);
  expect(first.questions.catalog.length).toBeGreaterThan(0);
  expect(first.requisitionCatalog.catalog.departments.length).toBeGreaterThan(0);
  expect(first.jobs.catalog.jobs[0]).not.toBe(second.jobs.catalog.jobs[0]);
  expect(first.questions.catalog[0]).not.toBe(second.questions.catalog[0]);
  expect(first.requisitionCatalog.catalog.departments).not.toBe(
    second.requisitionCatalog.catalog.departments,
  );
  const originalName = second.candidates.catalog.candidates[0].name;
  first.candidates.catalog.candidates[0].name = "Design preview";
  expect(second.candidates.catalog.candidates[0].name).toBe(originalName);
});

test("an unreadable saved session still opens login without loading catalogs", async () => {
  const services = createAppServices();
  jest.spyOn(services.sessions, "restore").mockRejectedValueOnce(new Error("Disk"));
  const loadJobs = jest.spyOn(services.jobs, "load");
  const view = await renderAsync(
    <AppProvider services={services}>
      <AuthScreen dashboardShortcuts={false} />
    </AppProvider>,
  );

  await waitFor(() =>
    expect(view.getByRole("button", { name: "Giriş Yap" })).toBeTruthy(),
  );
  expect(view.queryByRole("progressbar")).toBeNull();
  expect(loadJobs).not.toHaveBeenCalled();
  await view.unmountAsync();
});
