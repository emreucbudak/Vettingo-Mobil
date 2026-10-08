import { Question } from "../entities/Assessment";
export interface AssessmentRepository {
  load(): Promise<Question[]>;
}
