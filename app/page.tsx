"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  useAuth,
} from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n/provider";

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { t } = useI18n();

  useEffect(() => {
    if (isLoaded && isSignedIn) router.replace("/home");
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4 md:px-10">
        <p className="text-sm font-semibold tracking-wide">{t("quizApp")}</p>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Show when="signed-out">
            <SignInButton mode="redirect" forceRedirectUrl="/home">
              <button type="button" className="ui-btn-secondary !py-2">
                {t("logIn")}
              </button>
            </SignInButton>
            <SignUpButton mode="redirect" forceRedirectUrl="/home">
              <button type="button" className="ui-btn-primary !py-2">
                {t("signUp")}
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link href="/home" className="ui-btn-primary !py-2">
              {t("openApp")}
            </Link>
          </Show>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16 md:px-10">
        <div className="animate-fade-up max-w-2xl rounded-xl border border-border bg-surface p-8 md:p-10">
          <p className="text-4xl font-semibold tracking-tight md:text-5xl">
            {t("quizApp")}
          </p>
          <h1 className="mt-4 text-xl font-semibold leading-snug md:text-2xl">
            {t("landingTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">
            {t("landingBody")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Show when="signed-out">
              <Link href="/sign-in" className="ui-btn-primary">
                {t("signInToTest")}
              </Link>
              <Link href="/sign-up" className="ui-btn-secondary">
                {t("signUp")}
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/home" className="ui-btn-primary">
                {t("goDashboard")}
              </Link>
            </Show>
          </div>
        </div>
      </main>
    </div>
  );
}
