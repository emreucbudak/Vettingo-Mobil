import { Workspace } from "../../domain/entities/models";
import { Clock } from "../../domain/ports/DeviceServices";
import {
  ASSESSMENT_DURATION_MS,
  remainingSeconds,
} from "../../domain/policies/assessment";
import { RecruitmentQueries } from "./RecruitmentQueries";

export class AssessmentUseCases {
  constructor(
    private readonly queries: RecruitmentQueries,
    private readonly clock: Clock,
  ) {}
  now() {
    return this.clock.now();
  }
  remainingSeconds(state: Workspace, now: number) {
    return remainingSeconds(state.assessment, now);
  }
  start(state: Workspace): Workspace {
    return state.assessment.deadline !== null || state.assessment.finished
      ? state
      : {
          ...state,
          assessment: {
            ...state.assessment,
            deadline: this.clock.now() + ASSESSMENT_DURATION_MS,
          },
        };
  }
  answer(state: Workspace, questionId: string, optionId: string): Workspace {
    const question = this.queries.catalog.questions.find(
      (item) => item.id === questionId,
    );
    if (
      state.assessment.finished ||
      !question?.options.some((option) => option.id === optionId)
    )
      return state;
    if (
      state.assessment.deadline !== null &&
      this.remainingSeconds(state, this.clock.now()) === 0
    )
      return this.finish(state);
    return {
      ...state,
      assessment: {
        ...state.assessment,
        answers: { ...state.assessment.answers, [questionId]: optionId },
      },
    };
  }
  selectQuestion(state: Workspace, index: number): Workspace {
    return !Number.isInteger(index) ||
      index < 0 ||
      index >= this.queries.catalog.questions.length
      ? state
      : {
          ...state,
          assessment: { ...state.assessment, currentIndex: index },
        };
  }
  finish(state: Workspace): Workspace {
    return { ...state, assessment: { ...state.assessment, finished: true } };
  }
}
