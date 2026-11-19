export enum TrueFalseOptionType {
  True = 1,
  False = 2,
}

export interface TrueFalseOption {
  id: string;
  createdAt: string;
  trueFalseQuestionId: string;
  type: TrueFalseOptionType;
  isCorrect: boolean;
}
