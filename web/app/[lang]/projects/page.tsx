import { notFound } from "next/navigation";

import { CaseCard } from "@/components/content/case-card";
import { LangSwitch } from "@/components/content/lang-switch";
import { Reveal } from "@/components/motion/reveal";
import { getCasesByLocale } from "@/lib/content";
import { copy, hasLocale, type Locale } from "@/lib/i18n";

export default async function ProjectsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = copy[locale];
  const items = await getCasesByLocale(locale);

  return (
    <main className="space-y-10 pb-20">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-4xl md:text-5xl">{dict.projects.title}</h1>
        <LangSwitch locale={locale} pathAfterLocale={dict.paths.projects} />
      </header>

      <Reveal>
        <section className="grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <CaseCard
              key={`${item.locale}-${item.slug}`}
              item={item}
              locale={locale}
              tierA={dict.projects.tierA}
              tierB={dict.projects.tierB}
              projectsPath={dict.paths.projects}
              viewLabel={dict.projects.view}
            />
          ))}
        </section>
      </Reveal>
    </main>
  );
}
