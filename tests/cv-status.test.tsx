import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import { createAppServices } from "../src/composition/createAppServices";
import {
  AppProvider,
  useApp,
} from "../src/core/presentation/state/AppProvider";
import { Session } from "../src/features/auth/domain/entities/Session";
import { CvQueries } from "../src/features/cv/application/usecases/CvQueries";
import { ApiCvRepository } from "../src/features/cv/data/repositories/ApiCvRepository";
import DashboardScreen from "../src/features/dashboard/presentation/screens/DashboardScreen";

const credentials = {
  userId: "019a16b1-1234-7000-8000-000000000001",
  accessToken: "test-access-token",
};
const session: Session = {
  ...credentials,
  name: "Alex",
  email: "cv@vettingo.com",
  company: "",
  role: "candidate",
  remember: false,
};

function response(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test.each([true, false])(
  "requests the user's CV presence as boolean %s",
  async (exists) => {
    const request = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(response(exists));
    const queries = new CvQueries(new ApiCvRepository(request));

    await expect(queries.hasCv(credentials)).resolves.toBe(exists);
    expect(request).toHaveBeenCalledWith(
      `http://localhost:5083/api/evaluations/cv/user/${credentials.userId}/exists`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer test-access-token",
        },
      },
    );
  },
);

test.each([
  null,
  {},
  { userId: credentials.userId },
  { accessToken: credentials.accessToken },
  { ...credentials, userId: "invalid-guid" },
  { ...credentials, userId: "00000000-0000-0000-0000-000000000000" },
])(
  "does not request a CV without a valid backend identity: %j",
  async (identity) => {
    const repository = { hasCv: jest.fn() };
    await expect(new CvQueries(repository).hasCv(identity)).rejects.toThrow(
      "yeniden giriş yapın",
    );
    expect(repository.hasCv).not.toHaveBeenCalled();
  },
);

test.each([401, 403, 404, 429, 500])(
  "does not interpret HTTP %s as no CV",
  async (status) => {
    const request = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(response(false, status));
    await expect(
      new ApiCvRepository(request).hasCv(credentials),
    ).rejects.toThrow();
  },
);

test.each([null, "false", "true", 0, {}, { hasCv: false }])(
  "rejects non-boolean API result %j",
  async (body) => {
    const request = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(response(body));
    await expect(
      new ApiCvRepository(request).hasCv(credentials),
    ).rejects.toThrow();
  },
);

async function renderDashboard(
  request: typeof fetch,
  localCompleted = false,
  identity: Session = session,
) {
  const services = createAppServices();
  services.cv = new CvQueries(new ApiCvRepository(request));
  const state = services.sessions.createWorkspace();
  state.cv = { ...state.cv, completed: localCompleted };
  jest
    .spyOn(services.sessions, "restore")
    .mockResolvedValue({ session: identity, state });
  let app!: ReturnType<typeof useApp>;
  function Probe() {
    app = useApp();
    return <DashboardScreen />;
  }
  const view = await render(
    <AppProvider services={services}>
      <Probe />
    </AppProvider>,
  );
  return { view, services, getApp: () => app };
}

test.each([true, false])(
  "hides the card for API true even when local completed is %s",
  async (localCompleted) => {
    const request = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(response(true));
    const { view } = await renderDashboard(request, localCompleted);
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
    await act(async () => {});
    expect(view.queryByRole("button", { name: "CV oluştur" })).toBeNull();
    expect(view.queryByRole("alert")).toBeNull();
  },
  30000,
);

test.each([true, false])(
  "shows the card without a dismiss button for API false even when local completed is %s",
  async (localCompleted) => {
    const request = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(response(false));
    const { view } = await renderDashboard(request, localCompleted);
    await waitFor(() =>
      expect(view.getByRole("button", { name: "CV oluştur" })).toBeTruthy(),
    );
    await fireEvent.press(view.getByRole("button", { name: "CV oluştur" }));
    expect(router.push).toHaveBeenCalledWith("/cv-review");
    expect(
      view.queryByRole("button", { name: "CV oluşturma kartını kapat" }),
    ).toBeNull();
    expect(view.getByRole("button", { name: "CV oluştur" })).toBeTruthy();
  },
);

test("keeps the card hidden while waiting for the API result", async () => {
  let finish!: (result: Response) => void;
  const request = jest
    .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
    .mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
  const { view } = await renderDashboard(request);
  await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
  expect(view.queryByRole("button", { name: "CV oluştur" })).toBeNull();
  await act(async () => {
    finish(response(false));
  });
  expect(view.getByRole("button", { name: "CV oluştur" })).toBeTruthy();
});

test("keeps the card hidden on failure and retries the status request", async () => {
  const request = jest
    .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
    .mockResolvedValueOnce(response(false, 500))
    .mockResolvedValueOnce(response(false));
  const { view } = await renderDashboard(request);
  await waitFor(() => expect(view.getByRole("alert")).toBeTruthy());
  expect(view.queryByRole("button", { name: "CV oluştur" })).toBeNull();
  await fireEvent.press(
    view.getByRole("button", { name: "CV durumunu tekrar kontrol et" }),
  );
  await waitFor(() =>
    expect(view.getByRole("button", { name: "CV oluştur" })).toBeTruthy(),
  );
  expect(view.queryByRole("alert")).toBeNull();
});

test("does not fabricate a no-CV result for demo sessions", async () => {
  const request = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>();
  const { view } = await renderDashboard(request, false, {
    ...session,
    userId: undefined,
    accessToken: undefined,
  });
  await waitFor(() => expect(view.getByRole("alert")).toBeTruthy());
  expect(request).not.toHaveBeenCalled();
  expect(view.queryByRole("button", { name: "CV oluştur" })).toBeNull();
});

test("ignores an old account's late response after switching accounts", async () => {
  let finishOld!: (result: Response) => void;
  const request = jest
    .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
    .mockReturnValueOnce(
      new Promise((resolve) => {
        finishOld = resolve;
      }),
    )
    .mockResolvedValueOnce(response(false));
  const { view, services, getApp } = await renderDashboard(request);
  await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
  const nextSession = {
    ...session,
    userId: "019a16b1-1234-7000-8000-000000000002",
    email: "other@vettingo.com",
  };
  jest.spyOn(services.sessions, "signIn").mockResolvedValue({
    session: nextSession,
    state: services.sessions.createWorkspace(),
  });
  await act(async () => {
    await getApp().signIn({
      ...nextSession,
      password: "secret",
      register: false,
    });
  });
  await waitFor(() =>
    expect(view.getByRole("button", { name: "CV oluştur" })).toBeTruthy(),
  );
  await act(async () => {
    finishOld(response(true));
  });
  expect(view.getByRole("button", { name: "CV oluştur" })).toBeTruthy();
  expect(request).toHaveBeenCalledTimes(2);
});
