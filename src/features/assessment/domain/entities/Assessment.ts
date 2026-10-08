export interface Question {
  id: string;
  category: string;
  difficulty: string;
  prompt: string;
  fileName: string;
  code: string;
  options: { id: string; text: string }[];
}
export interface Assessment {
  answers: Record<string, string>;
  currentIndex: number;
  deadline: number | null;
  finished: boolean;
}
