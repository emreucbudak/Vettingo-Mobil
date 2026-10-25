import { z } from "zod";
import { AccountNotification } from "../../domain/entities/AccountNotification";
import { NotificationAuthenticationError } from "../../domain/errors/NotificationAuthenticationError";
import {
  NotificationCredentials,
  NotificationsRepository,
} from "../../domain/repositories/NotificationsRepository";

const notificationsResponse = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    message: z.string(),
    isRead: z.boolean(),
    createdAt: z.string().refine((value) => Number.isFinite(Date.parse(value))),
  }),
);

export class ApiNotificationsRepository implements NotificationsRepository {
  constructor(private readonly request: typeof fetch) {}

  async list({
    userId,
    accessToken,
  }: NotificationCredentials): Promise<readonly AccountNotification[]> {
    const response = await this.request(
      `http://localhost:5149/api/notifications/user/${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.status === 401 || response.status === 403) {
      throw new NotificationAuthenticationError();
    }
    if (!response.ok) {
      throw new Error("Bildirimler yüklenemedi. Lütfen tekrar deneyin.");
    }

    const result = notificationsResponse.safeParse(await response.json());
    if (!result.success) {
      throw new Error("Bildirimler yüklenemedi. Lütfen tekrar deneyin.");
    }
    // The endpoint already returns the latest 80 items, newest first.
    return result.data.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      createdAt: notification.createdAt,
      read: notification.isRead,
    }));
  }
}
