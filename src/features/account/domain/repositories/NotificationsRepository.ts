import { AccountNotification } from "../entities/AccountNotification";

export interface NotificationCredentials {
  userId: string;
  accessToken: string;
}

export interface NotificationsRepository {
  list(
    credentials: NotificationCredentials,
  ): Promise<readonly AccountNotification[]>;
}
