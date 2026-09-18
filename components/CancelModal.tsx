"use client";

import { useI18n } from "@/lib/i18n/provider";

export function CancelModal({
  open,
  onGoBack,
  onCancelQuiz,
}: {
  open: boolean;
  onGoBack: () => void;
  onCancelQuiz: () => void;
}) {
  const { t } = useI18n();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="animate-fade-up w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-foreground">{t("areYouSure")}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{t("cancelQuizHint")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={onGoBack} className="ui-btn-secondary">
            {t("keepGoing")}
          </button>
          <button
            type="button"
            onClick={onCancelQuiz}
            className="ui-btn-primary bg-danger hover:bg-red-800"
          >
            {t("cancelQuiz")}
          </button>
        </div>
      </div>
    </div>
  );
}
