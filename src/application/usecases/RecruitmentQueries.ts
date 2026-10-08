import {
  RecruitmentCatalog,
  Stage,
  Workspace,
} from "../../domain/entities/models";
import { RecruitmentRepository } from "../../domain/repositories/RecruitmentRepository";
import {
  candidateStage,
  filterJobs,
  matchesText,
} from "../../domain/policies/recruitment";
export class RecruitmentQueries {
  private loaded: RecruitmentCatalog | null = null;
  constructor(private readonly repository: RecruitmentRepository) {}
  async load() {
    this.loaded = await this.repository.load();
  }
  get catalog(): RecruitmentCatalog {
    if (!this.loaded) throw new Error("Recruitment catalog has not loaded");
    return this.loaded;
  }
  searchJobs(query: string, filters: string[]) {
    return filterJobs(this.catalog.jobs, query, filters);
  }
  findCandidate(id: string) {
    return [
      ...this.catalog.candidates,
      ...this.catalog.comparisonCandidates,
    ].find((item) => item.id === id);
  }
  searchCandidates(
    query: string,
    stage: Stage | "all",
    decisions: Workspace["decisions"],
  ) {
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
