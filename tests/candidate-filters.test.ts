import { Candidate } from "../src/features/candidates/domain/entities/Candidate";
import {
  CandidateFilter,
  matchesCandidateFilters,
} from "../src/features/candidates/domain/policies/filters";
import { candidates } from "../src/features/candidates/data/fixtures/candidates";
import { CandidatesQueries } from "../src/features/candidates/application/usecases/CandidatesQueries";
import { DemoCandidatesRepository } from "../src/features/candidates/data/repositories/DemoCandidatesRepository";

test("existing candidate queries keep all candidates without Scout filters", () => {
  const repository = new DemoCandidatesRepository();
  const queries = new CandidatesQueries(repository, repository.snapshot());
  expect(
    queries.search("", "all", {}).map((candidate) => candidate.id),
  ).toEqual(candidates.map((candidate) => candidate.id));
});

test("experience, salary and preference filters combine with inclusive range limits", () => {
  const candidate = candidates[1];
  const filters: CandidateFilter[] = [
    "experience:0:5",
    "salary:80000:80000",
    "remote",
  ];
  expect(matchesCandidateFilters(candidate, filters)).toBe(true);
  expect(
    matchesCandidateFilters({ ...candidate, experienceYears: 6 }, filters),
  ).toBe(false);
  expect(
    matchesCandidateFilters(
      { ...candidate, salaryExpectation: 80001 },
      filters,
    ),
  ).toBe(false);
  expect(
    matchesCandidateFilters(
      { ...candidate, workingPreference: "hybrid" },
      filters,
    ),
  ).toBe(false);
});

test("missing filter data stays visible by default and is excluded by an active filter", () => {
  const candidate: Candidate = {
    ...candidates[1],
    experienceYears: undefined,
    salaryExpectation: undefined,
    workingPreference: undefined,
  };
  expect(matchesCandidateFilters(candidate, [])).toBe(true);
  const filters: CandidateFilter[] = [
    "experience:0:5",
    "salary:0:50000",
    "remote",
  ];
  for (const filter of filters)
    expect(matchesCandidateFilters(candidate, [filter])).toBe(false);
});

test("Scout filters combine with skill search and the current decision stage", () => {
  const repository = new DemoCandidatesRepository();
  const queries = new CandidatesQueries(repository, repository.snapshot());
  expect(
    queries
      .search(
        "Leadership",
        "rejected",
        { "sarah-jenkins": { action: "rejected" } },
        ["experience:10:Infinity", "salary:100000:Infinity", "hybrid"],
      )
      .map((candidate) => candidate.id),
  ).toEqual(["sarah-jenkins"]);
});
