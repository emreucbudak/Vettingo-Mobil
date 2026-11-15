import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import { createAppServices } from "../src/composition/createAppServices";
import { AppProvider } from "../src/core/presentation/state/AppProvider";
import DashboardScreen from "../src/features/dashboard/presentation/screens/DashboardScreen";
import ProfileScreen from "../src/features/account/presentation/screens/ProfileScreen";
import ScoutScreen from "../src/features/candidates/presentation/screens/ScoutScreen";
import { RequisitionsScreen } from "../src/features/requisitions/presentation/screens/RequisitionsScreen";

async function signedIn(element: React.ReactElement, role: string) {
  await AsyncStorage.setItem(
    "vettingo:demo-session:v1",
    JSON.stringify({
      email: "scout@vettingo.com",
      name: "Alex",
      role,
      company: "Vettingo",
      remember: true,
    }),
  );
  const view = await render(
    <AppProvider services={createAppServices()}>{element}</AppProvider>,
  );
  await waitFor(() => expect(view.queryByRole("progressbar")).toBeNull());
  return view;
}

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

test.each(["employer", "hr"])(
  "%s can open Scout from home and create jobs from listings",
  async (role) => {
    const home = await signedIn(<DashboardScreen />, role);
    expect(
      home.queryByRole("button", { name: "Yeni İlan Oluştur" }),
    ).toBeNull();
    await fireEvent.press(
      home.getByRole("button", { name: "Scout · Yetenek Keşfet" }),
    );
    expect(router.push).toHaveBeenLastCalledWith({
      pathname: "/scout",
      params: { tab: "home" },
    });
    await home.unmount();

    const jobs = await signedIn(<RequisitionsScreen />, role);
    expect(jobs.getByText("Eşleşen ilan bulunamadı.")).toBeTruthy();
    expect(jobs.queryAllByRole("button", { name: /adaylarını gör$/ })).toEqual([]);
    await fireEvent.press(jobs.getByRole("button", { name: "Yeni İlan" }));
    expect(router.push).toHaveBeenLastCalledWith("/new-requisition");
    await jobs.unmount();
  },
  30000,
);

test("Scout shows no demo profiles before or after entering a search", async () => {
  const view = await signedIn(<ScoutScreen />, "employer");
  const search = view.getByLabelText("Yetenek Ara");
  expect(view.queryAllByRole("button", { name: /profilini aç/ })).toHaveLength(0);
  await fireEvent.changeText(search, "TypeScript");
  expect(view.queryAllByRole("button", { name: /profilini aç/ })).toHaveLength(0);
  expect(view.getByText("Henüz gösterilecek yetenek yok.")).toBeTruthy();
  await fireEvent.press(view.getByRole("button", { name: "Aramayı temizle" }));
  expect(view.getByLabelText("Yetenek Ara")).toHaveDisplayValue("");
  await view.unmount();
});

test.each(["employer", "hr"])(
  "%s Scout filters combine, replace and clear selections without a talent counter",
  async (role) => {
    const view = await signedIn(<ScoutScreen />, role);
    expect(view.queryByText(/^\d+ yetenek$/)).toBeNull();
    await fireEvent.press(view.getByRole("button", { name: "Filtreler" }));
    for (const name of ["Tecrübe", "Maaş", "Çalışma Tercihi"])
      expect(view.getByRole("header", { name })).toBeTruthy();
    await fireEvent.press(view.getByRole("button", { name: "0–5 yıl" }));
    await fireEvent.press(view.getByRole("button", { name: "50.000–100.000" }));
    await fireEvent.press(view.getByRole("button", { name: "Uzaktan" }));
    await fireEvent.press(view.getByRole("button", { name: "Kapat" }));
    expect(view.getByText("Henüz gösterilecek yetenek yok.")).toBeTruthy();

    await fireEvent.press(view.getByRole("button", { name: "Filtreler" }));
    expect(view.getByRole("button", { name: "0–5 yıl" })).toBeSelected();
    expect(view.getByRole("button", { name: "Uzaktan" })).toBeSelected();
    await fireEvent.press(view.getByRole("button", { name: "5–10 yıl" }));
    await fireEvent.press(view.getByRole("button", { name: "100.000+" }));
    expect(view.getByRole("button", { name: "0–5 yıl" })).not.toBeSelected();
    expect(
      view.getByRole("button", { name: "50.000–100.000" }),
    ).not.toBeSelected();
    await fireEvent.press(view.getByRole("button", { name: "Kapat" }));

    await fireEvent.press(view.getByRole("button", { name: "Filtreler" }));
    await fireEvent.press(view.getByRole("button", { name: "5–10 yıl" }));
    await fireEvent.press(view.getByRole("button", { name: "100.000+" }));
    await fireEvent.press(view.getByRole("button", { name: "Uzaktan" }));
    expect(view.getByRole("button", { name: "5–10 yıl" })).not.toBeSelected();
    expect(view.getByRole("button", { name: "100.000+" })).not.toBeSelected();
    expect(view.getByRole("button", { name: "Uzaktan" })).not.toBeSelected();
    await fireEvent.press(view.getByRole("button", { name: "Kapat" }));
    expect(view.queryAllByRole("button", { name: /profilini aç/ })).toHaveLength(
      0,
    );
    await view.unmount();
  },
  30000,
);

test("candidate home and profile do not show Scout entry points", async () => {
  for (const screen of [
    <DashboardScreen key="home" />,
    <ProfileScreen key="profile" />,
  ]) {
    const view = await signedIn(screen, "candidate");
    expect(
      view.queryByRole("button", { name: "Scout · Yetenek Keşfet" }),
    ).toBeNull();
    expect(view.queryByRole("button", { name: "Scout" })).toBeNull();
    expect(view.queryByRole("tab", { name: "Scout" })).toBeNull();
    await view.unmount();
  }
});
