export type Article = {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  createdAt: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
};

export type QuizAttempt = {
  articleId: string;
  answers: (number | null)[];
  score: number;
  completedAt: string;
};
