import { Question } from "../../domain/entities/Assessment";
import { AssessmentRepository } from "../../domain/repositories/AssessmentRepository";

export class AssessmentQueries {
  constructor(
    private readonly repository: AssessmentRepository,
    private loaded: Question[] | null = null,
  ) {}
  async load() {
    this.loaded = await this.repository.load();
  }
  get catalog(): Question[] {
    if (!this.loaded) throw new Error("assessment catalog has not loaded");
    return this.loaded;
  }
}
