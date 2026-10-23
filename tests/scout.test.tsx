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
  "%s can open Scout from home and profile and create jobs from listings",
  async (role) => {
    const home = await signedIn(<DashboardScreen />, role);
    expect(
      home.queryByRole("button", { name: "Yeni İlan Oluştur" }),
    ).toBeNull();
    await fireEvent.press(
      home.getByRole("button", { name: "Scout · Yetenek Keşfet" }),
    );
    expect(router.push).toHaveBeenLastCalledWith("/scout");
    await home.unmount();

    const profile = await signedIn(<ProfileScreen />, role);
    await fireEvent.press(profile.getByRole("button", { name: "Scout" }));
    expect(router.push).toHaveBeenLastCalledWith({
      pathname: "/scout",
      params: { tab: "profile" },
    });
    await profile.unmount();

    const jobs = await signedIn(<RequisitionsScreen />, role);
    await fireEvent.press(jobs.getByRole("button", { name: "Yeni İlan" }));
    expect(router.push).toHaveBeenLastCalledWith("/new-requisition");
    await jobs.unmount();
  },
  30000,
);

test("Scout searches skills, opens talent profiles and handles empty results", async () => {
  const view = await signedIn(<ScoutScreen />, "employer");
  const search = view.getByLabelText("Yetenek Ara");
  await fireEvent.changeText(search, "TypeScript");
  expect(view.getByText("Michael Ross")).toBeTruthy();
  expect(view.queryByText("Zeynep Kaya")).toBeNull();
  await fireEvent.press(
    view.getByRole("button", { name: "Michael Ross profilini aç" }),
  );
  expect(router.push).toHaveBeenLastCalledWith({
    pathname: "/candidate-detail",
    params: { id: "michael-ross" },
  });
  await fireEvent.changeText(search, "olmayan-yetenek");
  expect(view.getByText("Aramana uygun yetenek bulunamadı.")).toBeTruthy();
  await fireEvent.press(view.getByRole("button", { name: "Aramayı temizle" }));
  expect(view.getByText("Zeynep Kaya")).toBeTruthy();
  await view.unmount();
});

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
    await view.unmount();
  }
});
