import { Requisition } from "../entities/Requisition";

export function validateRequisition(draft: Requisition) {
  if (!draft.title.trim()) return "Devam etmek için pozisyon adını girin.";
  if (draft.locationType !== "remote" && !draft.office)
    return "Devam etmek için ofis seçin.";
  return null;
}
