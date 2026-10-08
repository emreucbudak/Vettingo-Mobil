import {
  CandidateCatalog,
  CandidateDecisions,
  Stage,
} from "../../domain/entities/Candidate";
import { CandidatesRepository } from "../../domain/repositories/CandidatesRepository";

import { matchesText } from "../../../../shared/domain/policies/search";
import { candidateStage } from "../../domain/policies/stage";
export class CandidatesQueries {
  private loaded: CandidateCatalog | null = null;
  constructor(private readonly repository: CandidatesRepository) {}
  async load() {
    this.loaded = await this.repository.load();
  }
  get catalog(): CandidateCatalog {
    if (!this.loaded) throw new Error("candidates catalog has not loaded");
    return this.loaded;
  }
  find(id: string) {
    return [
      ...this.catalog.candidates,
      ...this.catalog.comparisonCandidates,
    ].find((item) => item.id === id);
  }
  search(query: string, stage: Stage | "all", decisions: CandidateDecisions) {
    return this.catalog.candidates.filter(
      (candidate) =>
        matchesText(query, [
          candidate.name,
          candidate.role,
          candidate.appliedRole,
          ...candidate.skills.map((skill) => skill.name),
        ]) &&
        (stage === "all" || candidateStage(candidate, decisions) === stage),
    );
  }
}
