import React from "react";
import { act, render, waitFor } from "@testing-library/react-native";
import { createAppServices } from "../src/composition/createAppServices";
import { AppProvider } from "../src/core/presentation/state/AppProvider";
import { NotificationQueries } from "../src/features/account/application/usecases/NotificationQueries";
import { ApiNotificationsRepository } from "../src/features/account/data/repositories/ApiNotificationsRepository";
import { NotificationAuthenticationError } from "../src/features/account/domain/errors/NotificationAuthenticationError";
import NotificationsScreen from "../src/features/account/presentation/screens/NotificationsScreen";
import { Session } from "../src/features/auth/domain/entities/Session";

const credentials = {
  userId: "019a16b1-1234-7000-8000-000000000001",
  accessToken: "test-access-token",
};
const session: Session = {
  ...credentials,
  name: "Alex",
  email: "notifications@vettingo.com",
  company: "",
  role: "candidate",
  remember: false,
};
const notification = {
  id: "019a16b1-1234-7000-8000-000000000002",
  userId: credentials.userId,
  title: "Başvurunuz güncellendi",
  message: "Mülakat aşamasına geçtiniz.",
  isRead: false,
  createdAt: "2026-10-25T06:30:00Z",
};

function response(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

afterEach(() => jest.restoreAllMocks());

test("requests the authenticated user's latest notifications and maps the API fields", async () => {
  const items = Array.from({ length: 80 }, (_, index) => ({
    ...notification,
    id: `notification-${index}`,
    isRead: index > 0,
  }));
  const request = jest
    .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
    .mockResolvedValue(response(items));
  const queries = new NotificationQueries(
    new ApiNotificationsRepository(request),
  );

  const result = await queries.list(credentials);

  expect(request).toHaveBeenCalledTimes(1);
  expect(request).toHaveBeenCalledWith(
    `http://localhost:5149/api/notifications/user/${credentials.userId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer test-access-token",
      },
    },
  );
  expect(result).toHaveLength(80);
  expect(result[0]).toEqual({
    id: "notification-0",
    title: notification.title,
    message: notification.message,
    createdAt: notification.createdAt,
    read: false,
  });
  expect(result[79].id).toBe("notification-79");
  expect(result[79].read).toBe(true);
});

test.each([
  null,
  {},
  { userId: credentials.userId },
  { accessToken: credentials.accessToken },
])(
  "does not request notifications without a backend identity and token: %j",
  async (identity) => {
    const repository = { list: jest.fn() };
    await expect(
      new NotificationQueries(repository).list(identity),
    ).rejects.toBeInstanceOf(NotificationAuthenticationError);
    expect(repository.list).not.toHaveBeenCalled();
  },
);

test.each([401, 403, 500])(
  "rejects HTTP %s instead of treating it as an empty inbox",
  async (status) => {
    const request = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(response([], status));
    const repository = new ApiNotificationsRepository(request);
    await expect(repository.list(credentials)).rejects.toThrow(
      status === 500
        ? "Bildirimler yüklenemedi"
        : "hesabınıza yeniden giriş yapın",
    );
  },
);

test("rejects invalid API dates before rendering a card", async () => {
  const request = jest
    .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
    .mockResolvedValue(response([{ ...notification, createdAt: "invalid" }]));
  const repository = new ApiNotificationsRepository(request);
  await expect(repository.list(credentials)).rejects.toThrow(
    "Bildirimler yüklenemedi",
  );
});

async function renderNotifications(
  request: typeof fetch,
  identity: Session = session,
) {
  const services = createAppServices();
  services.notifications = new NotificationQueries(
    new ApiNotificationsRepository(request),
  );
  jest.spyOn(services.sessions, "restore").mockResolvedValue({
    session: identity,
    state: services.sessions.createWorkspace(),
  });
  return render(
    <AppProvider services={services}>
      <NotificationsScreen />
    </AppProvider>,
  );
}

test("shows API title, message, createdAt and unread badge in the notification cards", async () => {
  const request = jest
    .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
    .mockResolvedValue(
      response([
        notification,
        {
          ...notification,
          id: "read-notification",
          title: "Okunan bildirim",
          isRead: true,
        },
      ]),
    );
  const view = await renderNotifications(request);
  await waitFor(() => expect(view.getByText(notification.title)).toBeTruthy());
  expect(view.getAllByText(notification.message)).toHaveLength(2);
  expect(
    view.getAllByText(
      new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(notification.createdAt)),
    ),
  ).toHaveLength(2);
  expect(view.getAllByText("Yeni")).toHaveLength(1);
  expect(view.queryByText("Vettingo’ya hoş geldin!")).toBeNull();
  expect(view.queryByLabelText("Bildirimler yükleniyor")).toBeNull();
});

test("shows loading while waiting and an empty state for an empty API result", async () => {
  let finish!: (value: Response) => void;
  const request = jest
    .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
    .mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
  const view = await renderNotifications(request);
  await waitFor(() =>
    expect(view.getByLabelText("Bildirimler yükleniyor")).toBeTruthy(),
  );
  expect(view.queryByText("Henüz bildiriminiz bulunmuyor.")).toBeNull();
  await act(async () => {
    finish(response([]));
  });
  expect(view.getByText("Henüz bildiriminiz bulunmuyor.")).toBeTruthy();
});

test("hides error and retry UI when the request fails", async () => {
  const request = jest
    .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
    .mockRejectedValue(new Error("Network request failed"));
  const view = await renderNotifications(request);
  await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
  await act(async () => {});
  expect(view.queryByLabelText("Bildirimler yükleniyor")).toBeNull();
  expect(view.queryByText("Henüz bildiriminiz bulunmuyor.")).toBeNull();
  expect(view.queryByRole("button", { name: "Tekrar Dene" })).toBeNull();
  expect(view.queryByRole("alert")).toBeNull();
});

test.each(["candidate", "employer", "hr"] as const)(
  "%s demo sessions hide authentication and retry UI",
  async (role) => {
    const request = jest.fn<
      ReturnType<typeof fetch>,
      Parameters<typeof fetch>
    >();
    const view = await renderNotifications(request, {
      ...session,
      role,
      userId: undefined,
      accessToken: undefined,
    });
    await act(async () => {});
    expect(view.queryByLabelText("Bildirimler yükleniyor")).toBeNull();
    expect(view.queryByRole("alert")).toBeNull();
    expect(view.queryByRole("button", { name: "Tekrar Dene" })).toBeNull();
    expect(view.queryByText("Henüz bildiriminiz bulunmuyor.")).toBeNull();
    expect(request).not.toHaveBeenCalled();
    expect(view.queryByText("Vettingo’ya hoş geldin!")).toBeNull();
  },
);
