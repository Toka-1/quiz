"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CancelModal } from "@/components/CancelModal";
import {
  createQuiz,
  fetchQuiz,
  submitAttempt,
  type QuizDetail,
  type QuizQuestion,
} from "@/lib/api";
import { useI18n } from "@/lib/i18n/provider";

export default function QuizPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let data = await fetchQuiz(params.id);
        if (!data.quiz) {
          data = { quiz: (await createQuiz(params.id)).quiz };
        }
        if (cancelled || !data.quiz) return;
        setQuiz(data.quiz);
        setQuestions(data.quiz.questions);
        setAnswers(Array(data.quiz.questions.length).fill(null));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("quizFailed"));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id, t]);

  const current = questions[index];
  const total = questions.length;

  async function next() {
    if (selected === null || !current || !quiz) return;
    const nextAnswers = [...answers];
    nextAnswers[index] = selected;
    setAnswers(nextAnswers);

    if (index + 1 >= total) {
      setSubmitting(true);
      try {
        const result = await submitAttempt(params.id, quiz.id, nextAnswers);
        sessionStorage.setItem(
          `quiz-result-${params.id}`,
          JSON.stringify(result),
        );
        router.push(`/article/${params.id}/result`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit");
        setSubmitting(false);
      }
      return;
    }

    setIndex((i) => i + 1);
    setSelected(nextAnswers[index + 1]);
  }

  if (error && !current) {
    return (
      <AppShell title={t("quickTest")}>
        <p className="text-sm text-danger">{error}</p>
      </AppShell>
    );
  }

  if (!current) {
    return (
      <AppShell title={t("quickTest")}>
        <p className="text-sm text-muted">{t("preparingQuiz")}</p>
      </AppShell>
    );
  }

  return (
    <AppShell title={t("quickTest")}>
      <div className="animate-fade-up mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted">{t("quizHint")}</p>
          <button
            type="button"
            onClick={() => setCancelOpen(true)}
            className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-background"
          >
            {t("cancelQuiz")}
          </button>
        </div>

        <section className="rounded-xl border border-border bg-surface p-4 md:p-8">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {t("quickTest")}
            </p>
            <p className="rounded-lg bg-brand-soft px-3 py-1 text-xs font-semibold">
              {index + 1} / {total}
            </p>
          </div>

          <h2 className="mt-5 text-xl font-semibold leading-snug md:text-2xl">
            {current.question}
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {current.options.map((option, i) => {
              const active = selected === i;
              return (
                <button
                  key={`${current.id}-${i}`}
                  type="button"
                  onClick={() => setSelected(i)}
                  className={`rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                    active
                      ? "border-border-strong bg-brand-soft font-medium"
                      : "border-border bg-background hover:border-border-strong"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {error && <p className="mt-4 text-sm text-danger">{error}</p>}

          <button
            type="button"
            onClick={next}
            disabled={selected === null || submitting}
            className="ui-btn-primary mt-8 w-full"
          >
            {submitting
              ? t("saving")
              : index + 1 === total
                ? t("seeResult")
                : t("nextQuestion")}
          </button>
        </section>
      </div>

      <CancelModal
        open={cancelOpen}
        onGoBack={() => setCancelOpen(false)}
        onCancelQuiz={() => {
          setCancelOpen(false);
          router.push(`/article/${params.id}`);
        }}
      />
    </AppShell>
  );
}
