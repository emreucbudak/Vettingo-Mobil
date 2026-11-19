import type { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import type { TrueFalseQuestion } from "./TrueFalseQuestion";

export enum ExamOwnerType {
  System = 1,
  Company = 2,
}

export interface Exam {
  id: string;
  createdAt: string;
  companyId: string | null;
  ownerType: ExamOwnerType;
  title: string;
  durationMinutes: number;
  passingScore: number;
  isActive: boolean;
  updatedAt: string | null;
  multipleChoiceQuestions: readonly MultipleChoiceQuestion[];
  trueFalseQuestions: readonly TrueFalseQuestion[];
}
