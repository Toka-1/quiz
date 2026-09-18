"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  createQuiz,
  fetchArticle,
  type ArticleDetail,
} from "@/lib/api";
import { useI18n } from "@/lib/i18n/provider";

export default function ArticlePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [tab, setTab] = useState<"summary" | "content">("summary");
  const [expanded, setExpanded] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchArticle(params.id);
        if (!cancelled) setArticle(data.article);
      } catch {
        if (!cancelled) router.replace("/home");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id, router]);

  async function handleCreateQuiz() {
    if (!article) return;
    setQuizLoading(true);
    setError("");
    try {
      const existing = article.quizzes?.[0];
      if (existing?.questions?.length) {
        router.push(`/article/${article.id}/quiz`);
        return;
      }
      await createQuiz(article.id);
      router.push(`/article/${article.id}/quiz`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("quizFailed"));
    } finally {
      setQuizLoading(false);
    }
  }

  if (!article) {
    return (
      <AppShell>
        <p className="text-sm text-muted">{t("loadingArticle")}</p>
      </AppShell>
    );
  }

  const body =
    tab === "summary" ? article.summary ?? t("noSummary") : article.content;
  const long = body.length > 700;
  const shown = !expanded && long ? `${body.slice(0, 700)}…` : body;
  const hasQuiz = Boolean(article.quizzes?.[0]?.questions?.length);

  return (
    <AppShell title={article.title}>
      <div className="animate-fade-up mx-auto max-w-3xl">
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setTab("summary");
              setExpanded(false);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              tab === "summary"
                ? "bg-foreground text-white"
                : "border border-border bg-surface hover:bg-background"
            }`}
          >
            {t("seeSummarize")}
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("content");
              setExpanded(false);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              tab === "content"
                ? "bg-foreground text-white"
                : "border border-border bg-surface hover:bg-background"
            }`}
          >
            {t("seeContent")}
          </button>
        </div>

        <section className="rounded-xl border border-border bg-surface p-4 md:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            {t("articleQuizGenerator")}
          </p>
          <h1 className="mt-2 text-2xl font-semibold">{article.title}</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
            {tab === "summary" ? t("summarizedContent") : t("articleContentLabel")}
          </p>
          <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-foreground/90 md:text-[15px]">
            {shown}
          </p>
          {long && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 text-sm font-medium underline underline-offset-2"
            >
              {expanded ? t("showLess") : t("seeMore")}
            </button>
          )}

          {error && <p className="mt-4 text-sm text-danger">{error}</p>}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCreateQuiz}
              disabled={quizLoading || !article.summary}
              className="ui-btn-primary"
            >
              {quizLoading
                ? t("creatingQuiz")
                : hasQuiz
                  ? t("takeQuiz")
                  : t("createQuiz")}
            </button>
            <Link href="/home" className="ui-btn-secondary">
              {t("newArticleBtn")}
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
