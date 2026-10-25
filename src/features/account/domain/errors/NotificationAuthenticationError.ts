export class NotificationAuthenticationError extends Error {
  constructor() {
    super("Bildirimleri görmek için hesabınıza yeniden giriş yapın.");
  }
}
