import { NotificationAuthenticationError } from "../../domain/errors/NotificationAuthenticationError";
import {
  NotificationCredentials,
  NotificationsRepository,
} from "../../domain/repositories/NotificationsRepository";

export class NotificationQueries {
  constructor(private readonly repository: NotificationsRepository) {}

  async list(credentials: Partial<NotificationCredentials> | null) {
    if (!credentials?.userId || !credentials.accessToken) {
      throw new NotificationAuthenticationError();
    }
    return this.repository.list({
      userId: credentials.userId,
      accessToken: credentials.accessToken,
    });
  }
}
