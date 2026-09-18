export type ArticleListItem = {
  id: string;
  title: string;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { quizzes: number };
};

export type ArticleDetail = {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
  quizzes?: QuizDetail[];
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  order: number;
};

export type QuizDetail = {
  id: string;
  articleId?: string;
  questions: QuizQuestion[];
  attempts?: {
    id: string;
    answers: number[];
    score: number;
    createdAt: string;
  }[];
};

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data as T;
}

export async function fetchArticles() {
  const res = await fetch("/api/articles", { cache: "no-store" });
  return parseJson<{ articles: ArticleListItem[] }>(res);
}

export async function fetchArticle(articleId: string) {
  const res = await fetch(`/api/article/${articleId}`, { cache: "no-store" });
  return parseJson<{ article: ArticleDetail }>(res);
}

export async function generateSummary(input: {
  title?: string;
  content?: string;
  articleId?: string;
}) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson<{ article: ArticleDetail }>(res);
}

export async function createQuiz(articleId: string) {
  const res = await fetch(`/api/article/${articleId}/quizzes`, {
    method: "POST",
  });
  return parseJson<{ quiz: QuizDetail }>(res);
}

export async function fetchQuiz(articleId: string) {
  const res = await fetch(`/api/article/${articleId}/quizzes`, {
    cache: "no-store",
  });
  return parseJson<{ quiz: QuizDetail | null }>(res);
}

export async function submitAttempt(
  articleId: string,
  quizId: string,
  answers: (number | null)[],
) {
  const res = await fetch(
    `/api/article/${articleId}/quizzes/${quizId}/attempt`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    },
  );
  return parseJson<{
    attempt: {
      id: string;
      answers: number[];
      score: number;
    };
    quiz: QuizDetail;
  }>(res);
}
