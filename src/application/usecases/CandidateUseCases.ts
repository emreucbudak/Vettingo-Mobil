import { Candidate, Decision, Workspace } from "../../domain/entities/models";
import { Clock, SummarySharer } from "../../domain/ports/DeviceServices";
import { interviewDate } from "../../domain/policies/interview";

export class CandidateUseCases {
  constructor(
    private readonly clock: Clock,
    private readonly sharer: SummarySharer,
  ) {}
  interviewDate(date: string, time: string) {
    return interviewDate(date, time, this.clock.now());
  }
  decide(
    state: Workspace,
    candidateId: string,
    action: Decision,
    date?: string,
  ): Workspace {
    if (
      action === "interviewScheduled" &&
      (!date ||
        !Number.isFinite(Date.parse(date)) ||
        Date.parse(date) <= this.clock.now())
    )
      return state;
    return {
      ...state,
      decisions: {
        ...state.decisions,
        [candidateId]: {
          action,
          ...(action === "interviewScheduled" ? { date } : {}),
        },
      },
    };
  }
  share(candidate: Candidate) {
    return this.sharer.share(
      `${candidate.name} · Vettingo`,
      `${candidate.name}\n${candidate.role}\n${candidate.match}% Uyum\n\n${candidate.summary}`,
    );
  }
}
