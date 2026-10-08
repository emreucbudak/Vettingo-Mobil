import { JobCatalog } from "../entities/Job";
export interface JobsRepository {
  load(): Promise<JobCatalog>;
}
