import { RecruitmentCatalog } from "../entities/models";
export interface RecruitmentRepository {
  load(): Promise<RecruitmentCatalog>;
}
