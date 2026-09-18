"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { generateSummary } from "@/lib/api";
import { useI18n } from "@/lib/i18n/provider";
import { GENGHIS_CONTENT } from "@/lib/sample-data";

export default function HomeDashboard() {
  const router = useRouter();
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function fillSample() {
    setTitle("Genghis Khan");
    setContent(GENGHIS_CONTENT);
  }

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || content.trim().length < 40) {
      setError(t("formError"));
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { article } = await generateSummary({
        title: title.trim(),
        content: content.trim(),
      });
      router.push(`/article/${article.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("generateFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="animate-fade-up mx-auto max-w-3xl">
        <p className="text-sm leading-6 text-muted">{t("homeHint")}</p>

        <form
          onSubmit={handleGenerate}
          className="mt-6 space-y-5 rounded-xl border border-border bg-surface p-4 md:p-8"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">
              {t("articleTitle")}
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("articleTitlePlaceholder")}
              className="ui-input"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">
              {t("articleContent")}
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("articleContentPlaceholder")}
              rows={12}
              className="ui-input resize-y leading-6"
            />
          </label>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={loading} className="ui-btn-primary">
              {loading ? t("summarizing") : t("generateSummary")}
            </button>
            <button
              type="button"
              onClick={fillSample}
              className="ui-btn-secondary"
            >
              {t("useSample")}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
