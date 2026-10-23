import {
  Experience,
  Education,
} from "../../../../shared/domain/entities/Profile";

export type Stage =
  "screening" | "assessment" | "interview" | "offer" | "rejected";
export type Decision =
  "pending" | "advanced" | "rejected" | "interviewScheduled";
export type WorkingPreference = "remote" | "hybrid" | "onsite";
export interface Candidate {
  id: string;
  name: string;
  initials: string;
  role: string;
  appliedRole: string;
  experienceYears?: number;
  salaryExpectation?: number;
  workingPreference?: WorkingPreference;
  match: number;
  stage: Stage;
  skills: { name: string; level: string; score: number }[];
  summary: string;
  experiences: Experience[];
  education: Education[];
  requirements: { name: string; result: string }[];
}
export type CandidateDecisions = Record<
  string,
  { action: Decision; date?: string }
>;

export interface CandidateCatalog {
  candidates: Candidate[];
  comparisonCandidates: Candidate[];
}
