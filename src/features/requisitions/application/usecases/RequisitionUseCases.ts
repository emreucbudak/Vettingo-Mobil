import {
  Requisition,
  RequisitionState,
} from "../../domain/entities/Requisition";

import { Clock } from "../../../../shared/domain/ports/Clock";
import { validateRequisition } from "../../domain/policies/validation";

export class RequisitionUseCases {
  constructor(private readonly clock: Clock) {}
  validate = validateRequisition;
  validatePublication(draft: Requisition) {
    return (
      validateRequisition(draft) ||
      (!draft.description.trim() ? "Bir iş tanımı girin." : null)
    );
  }
  create(): Requisition {
    return {
      id: `requisition-${this.clock.now()}`,
      title: "",
      department: "",
      locationType: "remote",
      office: "",
      skills: [],
      marketCompensation: false,
      description: "",
      status: "Sourcing",
      candidateLabel: "New",
    };
  }
  saveDraft(state: RequisitionState, draft: Requisition): RequisitionState {
    return { ...state, draft };
  }
  publish(state: RequisitionState, requisition: Requisition): RequisitionState {
    if (this.validatePublication(requisition)) return state;
    return {
      ...state,
      draft: null,
      requisitions: [
        { ...requisition, title: requisition.title.trim() },
        ...state.requisitions.filter((item) => item.id !== requisition.id),
      ],
    };
  }
  generateDescription(draft: Requisition): Requisition {
    return {
      ...draft,
      description: `${draft.title || "Yeni pozisyon"} için ${draft.department || "ekibimize"} katılacak bir ekip arkadaşı arıyoruz.\n\nSorumluluklar:\n• Ölçeklenebilir çözümler geliştirmek\n• Ekipler arası iş birliği yapmak\n• Kalite ve sürdürülebilirliği artırmak\n\nAranan yetenekler: ${draft.skills.join(", ") || "İletişim, problem çözme"}.\nÇalışma modeli: ${draft.locationType}.`,
    };
  }
}
