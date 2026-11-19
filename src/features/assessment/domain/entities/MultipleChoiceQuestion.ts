import type { MultipleChoiceOption } from "./MultipleChoiceOption";

export interface MultipleChoiceQuestion {
  id: string;
  createdAt: string;
  examId: string;
  questionText: string;
  weight: number;
  displayOrder: number;
  options: MultipleChoiceOption[];
}
