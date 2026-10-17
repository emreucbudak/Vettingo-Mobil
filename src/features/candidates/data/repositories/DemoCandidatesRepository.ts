import { CandidatesRepository } from "../../domain/repositories/CandidatesRepository";
import { candidates, comparisonCandidates } from "../fixtures/candidates";
import { CandidateCatalog } from "../../domain/entities/Candidate";
export class DemoCandidatesRepository implements CandidatesRepository {
  async load() {
    return this.snapshot();
  }
  snapshot() {
    return JSON.parse(
      JSON.stringify({ candidates, comparisonCandidates }),
    ) as CandidateCatalog;
  }
}
