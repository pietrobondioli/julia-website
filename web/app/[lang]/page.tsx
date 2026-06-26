import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseCard } from "@/components/content/case-card";
import { LangSwitch } from "@/components/content/lang-switch";
import { CinematicHero } from "@/components/motion/cinematic-hero";
import { Reveal } from "@/components/motion/reveal";
import { getCasesByLocale } from "@/lib/content";
import { copy, hasLocale, type Locale } from "@/lib/i18n";

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = copy[locale];
  const items = await getCasesByLocale(locale);
  const featured = items.filter((item) => item.featured).slice(0, 5);
  const projectsPath = dict.paths.projects;

  return (
    <main className="space-y-16 pb-20">
      <header className="flex items-center justify-end">
        <LangSwitch locale={locale} pathAfterLocale="" />
      </header>

      <CinematicHero
        kicker={dict.home.kicker}
        title={dict.home.title}
        subtitle={dict.home.subtitle}
        ctaLabel={dict.home.cta}
        ctaHref={`/${locale}${projectsPath}`}
      />

      <Reveal>
        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl md:text-4xl">{dict.home.featured}</h2>
            <Link
              href={`/${locale}${projectsPath}`}
              className="text-sm text-black/70 hover:text-black"
            >
              {dict.home.cta} →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {(featured.length ? featured : items.slice(0, 4)).map((item) => (
              <CaseCard
                key={`${item.locale}-${item.slug}`}
                item={item}
                locale={locale}
                tierA={dict.projects.tierA}
                tierB={dict.projects.tierB}
                projectsPath={projectsPath}
                viewLabel={dict.projects.view}
              />
            ))}
          </div>
        </section>
      </Reveal>
    </main>
  );
}
