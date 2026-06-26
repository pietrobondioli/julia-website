import { notFound } from "next/navigation";

import { LangSwitch } from "@/components/content/lang-switch";
import { Reveal } from "@/components/motion/reveal";
import { copy, hasLocale, type Locale } from "@/lib/i18n";

const INSTAGRAM_URL = "https://instagram.com/";

export default async function ContactPage({
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
        <h1 className="text-4xl md:text-5xl">{dict.contact.title}</h1>
        <LangSwitch locale={locale} pathAfterLocale={dict.paths.contact} />
      </header>

      <Reveal>
        <section className="max-w-3xl rounded-2xl border border-black/10 bg-white p-6 md:p-8">
          <p className="text-black/80">{dict.contact.body}</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-black bg-black px-5 py-2.5 text-sm text-white transition hover:bg-black/85"
          >
            {dict.contact.cta}
            <span aria-hidden>↗</span>
          </a>
        </section>
      </Reveal>
    </main>
  );
}
