import { Cv } from "../../../features/cv/domain/entities/Cv";
import { Decision } from "../../../features/candidates/domain/entities/Candidate";
import { Job } from "../../../features/jobs/domain/entities/Job";
import { Requisition } from "../../../features/requisitions/domain/entities/Requisition";
export type WorkspaceCommand =
  | { type: "cv"; cv: Cv }
  | { type: "decision"; candidateId: string; action: Decision; date?: string }
  | { type: "apply"; job: Job }
  | { type: "draft"; draft: Requisition }
  | { type: "publish"; requisition: Requisition }
  | { type: "answer"; questionId: string; optionId: string }
  | { type: "question"; index: number }
  | { type: "start-assessment" }
  | { type: "finish-assessment" }
  | { type: "notifications"; enabled: boolean };
