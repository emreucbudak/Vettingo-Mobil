import { Assessment } from "../../domain/entities/Assessment";

import { Clock } from "../../../../shared/domain/ports/Clock";
import {
  ASSESSMENT_DURATION_MS,
  remainingSeconds,
} from "../../domain/policies/assessment";
import { AssessmentQueries } from "./AssessmentQueries";

export class AssessmentUseCases {
  constructor(
    private readonly queries: AssessmentQueries,
    private readonly clock: Clock,
  ) {}
  now() {
    return this.clock.now();
  }
  remainingSeconds(state: Assessment, now: number) {
    return remainingSeconds(state, now);
  }
  start(state: Assessment): Assessment {
    return state.deadline !== null || state.finished
      ? state
      : {
          ...state,
          deadline: this.clock.now() + ASSESSMENT_DURATION_MS,
        };
  }
  answer(state: Assessment, questionId: string, optionId: string): Assessment {
    const question = this.queries.catalog.find(
      (item) => item.id === questionId,
    );
    if (
      state.finished ||
      !question?.options.some((option) => option.id === optionId)
    )
      return state;
    if (
      state.deadline !== null &&
      this.remainingSeconds(state, this.clock.now()) === 0
    )
      return this.finish(state);
    return {
      ...state,
      answers: { ...state.answers, [questionId]: optionId },
    };
  }
  selectQuestion(state: Assessment, index: number): Assessment {
    return !Number.isInteger(index) ||
      index < 0 ||
      index >= this.queries.catalog.length
      ? state
      : {
          ...state,
          currentIndex: index,
        };
  }
  finish(state: Assessment): Assessment {
    return { ...state, finished: true };
  }
}
