import { notFound } from "next/navigation";

import { LangSwitch } from "@/components/content/lang-switch";
import { Reveal } from "@/components/motion/reveal";
import { copy, hasLocale, type Locale } from "@/lib/i18n";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = copy[locale];

  return (
    <main className="space-y-10 pb-20">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-4xl md:text-5xl">{dict.about.title}</h1>
        <LangSwitch locale={locale} pathAfterLocale={dict.paths.about} />
      </header>

      <Reveal>
        <section className="max-w-3xl space-y-4 rounded-2xl border border-black/10 bg-white p-6 md:p-8">
          <p className="leading-relaxed text-black/80">{dict.about.body}</p>
          <p className="text-sm text-black/55">
            Conteúdo será conectado em seguida aos arquivos:
            <br />
            <code>web/content/profile/profile.pt.md</code>
            <br />
            <code>web/content/profile/profile.en.md</code>
          </p>
        </section>
      </Reveal>
    </main>
  );
}
