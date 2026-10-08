import { JobsRepository } from "../../domain/repositories/JobsRepository";
import { jobs, recommendations } from "../fixtures/jobs";
import { JobCatalog } from "../../domain/entities/Job";
export class DemoJobsRepository implements JobsRepository {
  async load() {
    return JSON.parse(JSON.stringify({ jobs, recommendations })) as JobCatalog;
  }
}
