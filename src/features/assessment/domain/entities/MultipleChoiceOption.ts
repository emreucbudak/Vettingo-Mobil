export enum MultipleChoiceOptionOrder {
  A = 1,
  B = 2,
  C = 3,
  D = 4,
  E = 5,
}

export interface MultipleChoiceOption {
  id: string;
  createdAt: string;
  multipleChoiceQuestionId: string;
  optionText: string;
  isCorrect: boolean;
  order: MultipleChoiceOptionOrder;
}
