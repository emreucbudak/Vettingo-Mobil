import { Requisition, Workspace } from "../../domain/entities/models";
import { Clock } from "../../domain/ports/DeviceServices";
import { validateRequisition } from "../../domain/policies/recruitment";

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
  saveDraft(state: Workspace, draft: Requisition): Workspace {
    return { ...state, draft };
  }
  publish(state: Workspace, requisition: Requisition): Workspace {
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
