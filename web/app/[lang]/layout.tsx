import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { SideNav } from "@/components/layout/side-nav";
import { copy, hasLocale, type Locale, locales } from "@/lib/i18n";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const labels = copy[locale].nav;
  const paths = copy[locale].paths;

  return (
    <div className="min-h-screen bg-[var(--editorial-muted)] text-[var(--editorial-ink)]">
      <SideNav locale={locale} labels={labels} paths={paths} />
      <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8 lg:pl-28 lg:pr-10">{children}</div>
    </div>
  );
}
