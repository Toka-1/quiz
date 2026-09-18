"use client";

import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/dictionaries";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  function select(next: Locale) {
    setLocale(next);
  }

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-lg border border-border bg-surface p-1 text-xs font-semibold ${className}`}
      role="group"
      aria-label={t("language")}
    >
      <button
        type="button"
        onClick={() => select("en")}
        className={`rounded-md px-2.5 py-1 transition ${
          locale === "en"
            ? "bg-foreground text-white"
            : "text-muted hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => select("mn")}
        className={`rounded-md px-2.5 py-1 transition ${
          locale === "mn"
            ? "bg-foreground text-white"
            : "text-muted hover:text-foreground"
        }`}
      >
        MN
      </button>
    </div>
  );
}
