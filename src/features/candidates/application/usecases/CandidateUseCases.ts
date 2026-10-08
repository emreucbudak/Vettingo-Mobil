import {
  Candidate,
  Decision,
  CandidateDecisions,
} from "../../domain/entities/Candidate";

import { Clock } from "../../../../shared/domain/ports/Clock";
import { SummarySharer } from "../../domain/ports/SummarySharer";
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
    decisions: CandidateDecisions,
    candidateId: string,
    action: Decision,
    date?: string,
  ): CandidateDecisions {
    if (
      action === "interviewScheduled" &&
      (!date ||
        !Number.isFinite(Date.parse(date)) ||
        Date.parse(date) <= this.clock.now())
    )
      return decisions;
    return {
      ...decisions,
      [candidateId]: {
        action,
        ...(action === "interviewScheduled" ? { date } : {}),
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
