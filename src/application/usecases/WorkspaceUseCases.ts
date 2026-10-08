import { Workspace } from "../../domain/entities/models";
import { WorkspaceCommand } from "../contracts/WorkspaceCommand";
import { CvUseCases } from "./CvUseCases";
import { CandidateUseCases } from "./CandidateUseCases";
import { RequisitionUseCases } from "./RequisitionUseCases";
import { AssessmentUseCases } from "./AssessmentUseCases";
import { ApplicationUseCases } from "./ApplicationUseCases";

// The presentation dispatches commands; workflow-specific use cases own the rules.
export class WorkspaceUseCases {
  constructor(
    readonly cv: CvUseCases,
    readonly candidates: CandidateUseCases,
    readonly requisitions: RequisitionUseCases,
    readonly assessment: AssessmentUseCases,
    readonly applications: ApplicationUseCases,
  ) {}
  execute(state: Workspace, command: WorkspaceCommand): Workspace {
    switch (command.type) {
      case "cv": {
        const cv = this.cv.complete(command.cv);
        return cv ? { ...state, cv } : state;
      }
      case "decision":
        return this.candidates.decide(
          state,
          command.candidateId,
          command.action,
          command.date,
        );
      case "apply":
        return this.applications.apply(state, command.job);
      case "draft":
        return this.requisitions.saveDraft(state, command.draft);
      case "publish":
        return this.requisitions.publish(state, command.requisition);
      case "answer":
        return this.assessment.answer(
          state,
          command.questionId,
          command.optionId,
        );
      case "question":
        return this.assessment.selectQuestion(state, command.index);
      case "start-assessment":
        return this.assessment.start(state);
      case "finish-assessment":
        return this.assessment.finish(state);
      case "notifications":
        return { ...state, notifications: command.enabled };
    }
  }
}
