import { JobCatalog } from "../../domain/entities/Job";
import { JobsRepository } from "../../domain/repositories/JobsRepository";
import { filterJobs } from "../../domain/policies/search";

export class JobsQueries {
  private loaded: JobCatalog | null = null;
  constructor(private readonly repository: JobsRepository) {}
  async load() {
    this.loaded = await this.repository.load();
  }
  get catalog(): JobCatalog {
    if (!this.loaded) throw new Error("jobs catalog has not loaded");
    return this.loaded;
  }
  search(query: string, filters: string[]) {
    return filterJobs(this.catalog.jobs, query, filters);
  }
}
