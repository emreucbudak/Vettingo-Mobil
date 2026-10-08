import { CandidateCatalog } from "../entities/Candidate";
export interface CandidatesRepository {
  load(): Promise<CandidateCatalog>;
}
