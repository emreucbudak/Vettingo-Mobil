import { AccountNotification } from "../../domain/entities/AccountNotification";

export const notifications: readonly AccountNotification[] = [
  {
    id: "welcome",
    title: "Vettingo’ya hoş geldin!",
    message:
      "Hesabın hazır. Profilini tamamlayarak Vettingo deneyimine başlayabilirsin.",
    createdAt: "2026-10-25T09:30:00+03:00",
    read: false,
  },
];
