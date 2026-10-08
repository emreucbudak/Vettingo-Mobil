import { Workspace } from "../../domain/entities/Workspace";
import { WorkspaceCommand } from "../contracts/WorkspaceCommand";
import { CvUseCases } from "../../../features/cv/application/usecases/CvUseCases";
import { CandidateUseCases } from "../../../features/candidates/application/usecases/CandidateUseCases";
import { RequisitionUseCases } from "../../../features/requisitions/application/usecases/RequisitionUseCases";
import { AssessmentUseCases } from "../../../features/assessment/application/usecases/AssessmentUseCases";
import { ApplicationUseCases } from "../../../features/applications/application/usecases/ApplicationUseCases";
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
      case "decision": {
        const decisions = this.candidates.decide(
          state.decisions,
          command.candidateId,
          command.action,
          command.date,
        );
        return decisions === state.decisions ? state : { ...state, decisions };
      }
      case "apply": {
        const applications = this.applications.apply(
          state.applications,
          command.job,
        );
        return applications === state.applications
          ? state
          : { ...state, applications };
      }
      case "draft":
        return {
          ...state,
          ...this.requisitions.saveDraft(
            { draft: state.draft, requisitions: state.requisitions },
            command.draft,
          ),
        };
      case "publish": {
        const slice = { draft: state.draft, requisitions: state.requisitions };
        const result = this.requisitions.publish(slice, command.requisition);
        return result === slice ? state : { ...state, ...result };
      }
      case "answer": {
        const assessment = this.assessment.answer(
          state.assessment,
          command.questionId,
          command.optionId,
        );
        return assessment === state.assessment
          ? state
          : { ...state, assessment };
      }
      case "question": {
        const assessment = this.assessment.selectQuestion(
          state.assessment,
          command.index,
        );
        return assessment === state.assessment
          ? state
          : { ...state, assessment };
      }
      case "start-assessment": {
        const assessment = this.assessment.start(state.assessment);
        return assessment === state.assessment
          ? state
          : { ...state, assessment };
      }
      case "finish-assessment":
        return {
          ...state,
          assessment: this.assessment.finish(state.assessment),
        };
      case "notifications":
        return { ...state, notifications: command.enabled };
    }
  }
}
