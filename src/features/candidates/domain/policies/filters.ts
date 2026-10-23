import { Candidate, WorkingPreference } from "../entities/Candidate";

export type CandidateFilter =
  | `experience:${number}:${number | "Infinity"}`
  | `salary:${number}:${number | "Infinity"}`
  | WorkingPreference;

export function matchesCandidateFilters(
  candidate: Candidate,
  filters: CandidateFilter[],
) {
  return filters.every((filter) => {
    if (filter.startsWith("experience:") || filter.startsWith("salary:")) {
      const [kind, min, max] = filter.split(":");
      const value =
        kind === "experience"
          ? candidate.experienceYears
          : candidate.salaryExpectation;
      return (
        value !== undefined && value >= Number(min) && value <= Number(max)
      );
    }
    return candidate.workingPreference === filter;
  });
}
