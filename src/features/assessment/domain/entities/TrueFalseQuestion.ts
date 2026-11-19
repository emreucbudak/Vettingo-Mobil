import type { TrueFalseOption } from "./TrueFalseOption";

export interface TrueFalseQuestion {
  id: string;
  createdAt: string;
  examId: string;
  questionText: string;
  weight: number;
  displayOrder: number;
  options: TrueFalseOption[];
}
