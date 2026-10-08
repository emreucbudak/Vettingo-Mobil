import { Question } from "../../domain/entities/Assessment";
import { AssessmentRepository } from "../../domain/repositories/AssessmentRepository";

export class AssessmentQueries {
  private loaded: Question[] | null = null;
  constructor(private readonly repository: AssessmentRepository) {}
  async load() {
    this.loaded = await this.repository.load();
  }
  get catalog(): Question[] {
    if (!this.loaded) throw new Error("assessment catalog has not loaded");
    return this.loaded;
  }
}
