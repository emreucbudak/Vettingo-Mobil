import { AssessmentRepository } from "../../domain/repositories/AssessmentRepository";
import { questions } from "../fixtures/questions";
import { Question } from "../../domain/entities/Assessment";
export class DemoAssessmentRepository implements AssessmentRepository {
  async load() {
    return JSON.parse(JSON.stringify(questions)) as Question[];
  }
}
