import { notFound } from "next/navigation";

import { LangSwitch } from "@/components/content/lang-switch";
import { MediaGallery } from "@/components/content/media-gallery";
import { Reveal } from "@/components/motion/reveal";
import { getCaseBySlug } from "@/lib/content";
import { hasLocale, type Locale } from "@/lib/i18n";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const item = await getCaseBySlug(locale, slug);
  if (!item) notFound();

  return (
    <main className="space-y-10 pb-20">
      <header className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.2em] text-black/55">
            {item.client ?? "Projeto"}
          </p>
          <LangSwitch locale={locale} pathAfterLocale={`/projects/${slug}`} />
        </div>
        <h1 className="text-4xl md:text-6xl">{item.title}</h1>
        <p className="text-sm text-black/65">{item.year ?? ""}</p>
      </header>

      <Reveal>
        <article className="prose prose-zinc max-w-3xl whitespace-pre-wrap leading-relaxed">
          {item.body}
        </article>
      </Reveal>

      <Reveal>
        <MediaGallery locale={locale} gallery={item.gallery} video={item.video} />
      </Reveal>
    </main>
  );
}
