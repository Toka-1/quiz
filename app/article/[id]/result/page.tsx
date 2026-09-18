"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { fetchQuiz, type QuizQuestion } from "@/lib/api";
import { useI18n } from "@/lib/i18n/provider";

type StoredResult = {
  attempt: { answers: number[]; score: number };
  quiz: { questions: QuizQuestion[] };
};

export default function ResultPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const [result, setResult] = useState<StoredResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(`quiz-result-${params.id}`);
    if (raw) {
      try {
        setResult(JSON.parse(raw) as StoredResult);
        return;
      } catch {
        /* fall through */
      }
    }

    (async () => {
      try {
        const data = await fetchQuiz(params.id);
        const attempt = data.quiz?.attempts?.[0];
        if (!data.quiz || !attempt) {
          router.replace(`/article/${params.id}`);
          return;
        }
        setResult({
          attempt: { answers: attempt.answers, score: attempt.score },
          quiz: { questions: data.quiz.questions },
        });
      } catch {
        router.replace(`/article/${params.id}`);
      }
    })();
  }, [params.id, router]);

  if (!result) {
    return (
      <AppShell title={t("quizCompleted")}>
        <p className="text-sm text-muted">{t("loadingResults")}</p>
      </AppShell>
    );
  }

  const { attempt, quiz } = result;
  const questions = quiz.questions;

  return (
    <AppShell title={t("quizCompleted")}>
      <div className="animate-fade-up mx-auto max-w-2xl">
        <section className="rounded-xl border border-border bg-surface p-4 md:p-8">
          <p className="text-sm text-muted">{t("letsSee")}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {t("yourScore")}: {attempt.score} / {questions.length}
          </h1>

          <div className="mt-8 space-y-4">
            {questions.map((q, i) => {
              const userAnswer = attempt.answers[i];
              const correct = userAnswer === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <p className="text-sm font-semibold">
                    {i + 1}. {q.question}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {t("yourAnswer")}:{" "}
                    <span
                      className={
                        correct
                          ? "font-medium text-success"
                          : "font-medium text-danger"
                      }
                    >
                      {userAnswer < 0
                        ? "—"
                        : q.options[userAnswer] ?? "—"}
                    </span>
                  </p>
                  {!correct && (
                    <p className="mt-1 text-sm text-muted">
                      {t("correct")}:{" "}
                      <span className="font-medium text-success">
                        {q.options[q.correctIndex]}
                      </span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/article/${params.id}/quiz`}
              className="ui-btn-primary"
            >
              {t("restartQuiz")}
            </Link>
            <Link
              href={`/article/${params.id}`}
              className="ui-btn-secondary"
            >
              {t("saveAndLeave")}
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
