"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { fetchArticles, type ArticleListItem } from "@/lib/api";
import { useI18n } from "@/lib/i18n/provider";

export function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const pathname = usePathname();
  const { t } = useI18n();
  const { user, isLoaded } = useUser();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const heading = title ?? t("articleQuizGenerator");

  const loadArticles = useCallback(async () => {
    try {
      const data = await fetchArticles();
      setArticles(data.articles);
    } catch {
      setArticles([]);
    }
  }, []);

  useEffect(() => {
    void loadArticles();
  }, [pathname, loadArticles]);

  const displayName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "User";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-text transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-sidebar-muted">
              {t("quizApp")}
            </p>
            <h1 className="mt-1 text-lg font-semibold">{t("history")}</h1>
          </div>
          <button
            type="button"
            className="rounded-md px-2 py-1 text-sidebar-muted hover:bg-sidebar-active lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <Link
            href="/home"
            onClick={() => setSidebarOpen(false)}
            className={`mb-3 block rounded-lg px-3 py-2 text-sm transition ${
              pathname === "/home"
                ? "bg-foreground text-white"
                : "text-sidebar-muted hover:bg-sidebar-active hover:text-foreground"
            }`}
          >
            {t("newArticle")}
          </Link>

          {articles.length === 0 ? (
            <p className="px-3 text-sm text-sidebar-muted">{t("emptyHistory")}</p>
          ) : (
            <ul className="space-y-1">
              {articles.map((article) => {
                const active = pathname.includes(`/article/${article.id}`);
                return (
                  <li key={article.id}>
                    <Link
                      href={`/article/${article.id}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                        active
                          ? "bg-sidebar-active font-medium text-foreground"
                          : "text-sidebar-text hover:bg-sidebar-active"
                      }`}
                    >
                      <span className="line-clamp-2">
                        {article.title || t("untitled")}
                      </span>
                      <span className="mt-0.5 block text-xs text-sidebar-muted">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>

        <div className="border-t border-sidebar-border px-5 py-4">
          <div className="flex items-center gap-3">
            <UserButton />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {isLoaded ? displayName : "…"}
              </p>
              <p className="truncate text-xs text-sidebar-muted">{email}</p>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-surface px-4 py-3 md:px-8">
          <button
            type="button"
            className="rounded-lg border border-border px-3 py-1.5 text-sm lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            {t("menu")}
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
              {t("quizApp")}
            </p>
            <h2 className="truncate text-lg font-semibold text-foreground">
              {heading}
            </h2>
          </div>
          <LanguageToggle />
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
