import { RecruitmentCatalog } from "../../domain/entities/models";
import { RecruitmentRepository } from "../../domain/repositories/RecruitmentRepository";
import {
  jobs,
  recommendations,
  candidates,
  comparisonCandidates,
  questions,
  catalog,
} from "../fixtures/demo";
export class DemoRecruitmentRepository implements RecruitmentRepository {
  async load(): Promise<RecruitmentCatalog> {
    return JSON.parse(
      JSON.stringify({
        jobs,
        recommendations,
        candidates,
        comparisonCandidates,
        questions,
        filters: catalog,
      }),
    );
  }
}
