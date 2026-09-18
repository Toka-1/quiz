import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/provider";
import "./globals.css";

const display = Manrope({
  variable: "--font-display",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Quiz app — Article Quiz Generator",
  description:
    "Paste an article, generate a summary, and take a quick knowledge quiz.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <ClerkProvider>
          <I18nProvider>{children}</I18nProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
