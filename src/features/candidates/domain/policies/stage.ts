import { Candidate, CandidateDecisions } from "../entities/Candidate";

export function candidateStage(
  candidate: Candidate,
  decisions: CandidateDecisions,
) {
  const action = decisions[candidate.id]?.action;
  return action === "rejected"
    ? "rejected"
    : action === "advanced"
      ? "offer"
      : action === "interviewScheduled"
        ? "interview"
        : candidate.stage;
}
