"use client";

import type { Article, QuizAttempt, QuizQuestion } from "./types";

const ARTICLES_KEY = "quizapp.articles";
const QUIZ_KEY = "quizapp.quizzes";
const ATTEMPT_KEY = "quizapp.attempts";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getArticles(): Article[] {
  return readJson<Article[]>(ARTICLES_KEY, []).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export function getArticle(id: string): Article | undefined {
  return getArticles().find((a) => a.id === id);
}

export function saveArticle(article: Article) {
  const list = getArticles().filter((a) => a.id !== article.id);
  list.unshift(article);
  writeJson(ARTICLES_KEY, list);
}

export function deleteArticle(id: string) {
  writeJson(
    ARTICLES_KEY,
    getArticles().filter((a) => a.id !== id),
  );
  const quizzes = readJson<Record<string, QuizQuestion[]>>(QUIZ_KEY, {});
  delete quizzes[id];
  writeJson(QUIZ_KEY, quizzes);
}

export function saveQuiz(articleId: string, questions: QuizQuestion[]) {
  const quizzes = readJson<Record<string, QuizQuestion[]>>(QUIZ_KEY, {});
  quizzes[articleId] = questions;
  writeJson(QUIZ_KEY, quizzes);
}

export function getQuiz(articleId: string): QuizQuestion[] | null {
  const quizzes = readJson<Record<string, QuizQuestion[]>>(QUIZ_KEY, {});
  return quizzes[articleId] ?? null;
}

export function saveAttempt(attempt: QuizAttempt) {
  const attempts = readJson<Record<string, QuizAttempt>>(ATTEMPT_KEY, {});
  attempts[attempt.articleId] = attempt;
  writeJson(ATTEMPT_KEY, attempts);
}

export function getAttempt(articleId: string): QuizAttempt | null {
  const attempts = readJson<Record<string, QuizAttempt>>(ATTEMPT_KEY, {});
  return attempts[articleId] ?? null;
}

export function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
